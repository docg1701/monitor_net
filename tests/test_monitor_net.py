import pytest
import subprocess
import logging # Added for logger spec
import argparse # Added to fix NameError
from unittest.mock import MagicMock, call
# Assuming monitor_net.py is in the parent directory or PYTHONPATH is set up.
# This might require adjustment if running pytest from the tests/ directory directly
# without further pytest configuration (e.g. pythonpath in pytest.ini or conftest.py)
import sys
import os
import time # For mocking time.sleep

# Add the parent directory to sys.path to allow direct import of monitor_net
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from monitor_net import NetworkMonitor, DEFAULT_HOST_ARG, \
    DEFAULT_PING_INTERVAL_SECONDS_ARG, DEFAULT_GRAPH_Y_MAX_ARG, \
    DEFAULT_Y_TICKS_ARG, main, EXIT_CODE_ERROR # Import main and EXIT_CODE_ERROR

# Using a standard exception to break the loop for simplicity in testing
# class TestLoopExit(Exception): # PytestCollectionWarning for __init__ is a known quirk, not an error.
#     pass

# Helper to create a NetworkMonitor instance with default args for testing
@pytest.fixture
def monitor_instance(mocker):
    # Mock argparse.Namespace for default arguments
    mock_args = mocker.MagicMock(spec=argparse.Namespace)
    mock_args.host = DEFAULT_HOST_ARG
    mock_args.interval = DEFAULT_PING_INTERVAL_SECONDS_ARG
    mock_args.ymax = DEFAULT_GRAPH_Y_MAX_ARG
    mock_args.yticks = DEFAULT_Y_TICKS_ARG

    monitor = NetworkMonitor(mock_args)
    # Mock the logger and its specific methods to ensure they support assertions
    # and prevent actual log output during tests.
    monitor.logger = mocker.MagicMock(spec=logging.Logger)
    # It's generally better to let MagicMock create method mocks on demand,
    # or mock specific methods if they need special behavior (like side_effects).
    # The spec=logging.Logger should make attributes like .warning also behave as mocks
    # that record calls and have assertion methods.
    return monitor


def test_measure_latency_success(monitor_instance, mocker):
    """Test successful ping returns latency float."""
    mock_proc_result = MagicMock()
    mock_proc_result.returncode = 0
    mock_proc_result.stdout = "64 bytes from 1.1.1.1: icmp_seq=1 ttl=50 time=10.5 ms"
    mock_subprocess_run = mocker.patch('subprocess.run', return_value=mock_proc_result)

    result = monitor_instance._measure_latency()
    assert result == 10.5
    mock_subprocess_run.assert_called_once()
    # Check basic call args if necessary, e.g., ping command part
    call_args = mock_subprocess_run.call_args[0][0]
    assert "ping" in call_args
    assert monitor_instance.host in call_args


def test_measure_latency_failure_return_code(monitor_instance, mocker):
    """Test ping failure (non-zero return code) returns None."""
    mock_proc_result = MagicMock()
    mock_proc_result.returncode = 1
    mock_proc_result.stdout = "" # stdout might be empty or have error info
    mock_proc_result.stderr = "ping: unknown host someotherhost"
    mock_subprocess_run = mocker.patch('subprocess.run', return_value=mock_proc_result)

    result = monitor_instance._measure_latency()
    assert result is None
    mock_subprocess_run.assert_called_once()


def test_measure_latency_subprocess_timeout(monitor_instance, mocker):
    """Test subprocess.TimeoutExpired returns None."""
    mock_subprocess_run = mocker.patch(
        'subprocess.run', side_effect=subprocess.TimeoutExpired(cmd="ping", timeout=5)
    )

    result = monitor_instance._measure_latency()
    assert result is None
    mock_subprocess_run.assert_called_once()
    # Assert logger was called with a warning about timeout
    monitor_instance.logger.warning.assert_called_with(
        f"Ping to {monitor_instance.host} timed out (subprocess)."
    )


def test_measure_latency_file_not_found(monitor_instance, mocker):
    """Test FileNotFoundError for ping command re-raises FileNotFoundError."""
    mock_subprocess_run = mocker.patch(
        'subprocess.run', side_effect=FileNotFoundError("ping command not found")
    )

    with pytest.raises(FileNotFoundError):
        monitor_instance._measure_latency()

    mock_subprocess_run.assert_called_once()
    # Assert critical log message was made
    monitor_instance.logger.critical.assert_called_once_with(
        "CRITICAL ERROR: 'ping' command not found. "
        "Please ensure it is installed and in your PATH."
    )


def test_measure_latency_success_no_time_in_output(monitor_instance, mocker):
    """Test successful ping but no 'time=' in output returns None."""
    mock_proc_result = MagicMock()
    mock_proc_result.returncode = 0
    mock_proc_result.stdout = "some other output without time information"
    mock_subprocess_run = mocker.patch('subprocess.run', return_value=mock_proc_result)

    result = monitor_instance._measure_latency()
    assert result is None
    mock_subprocess_run.assert_called_once()
    # Assert logger was called with a warning about missing time
    monitor_instance.logger.warning.assert_called_with(
        "Ping successful but no time found in output."
    )

# --- Tests for Statistical Calculation Methods ---

def test_calculate_average_latency_empty(monitor_instance):
    monitor_instance.latency_history_real_values = []
    assert monitor_instance._calculate_average_latency() is None

def test_calculate_average_latency_all_none(monitor_instance):
    monitor_instance.latency_history_real_values = [None, None, None]
    assert monitor_instance._calculate_average_latency() is None

def test_calculate_average_latency_single_value(monitor_instance):
    monitor_instance.latency_history_real_values = [10.0]
    assert monitor_instance._calculate_average_latency() == 10.0

def test_calculate_average_latency_multiple_values(monitor_instance):
    monitor_instance.latency_history_real_values = [10.0, 20.0, 30.0]
    assert monitor_instance._calculate_average_latency() == 20.0

def test_calculate_average_latency_with_nones(monitor_instance):
    monitor_instance.latency_history_real_values = [10.0, None, 20.0, None, 30.0]
    assert monitor_instance._calculate_average_latency() == 20.0


def test_calculate_min_latency_empty(monitor_instance):
    monitor_instance.latency_history_real_values = []
    assert monitor_instance._calculate_min_latency() is None

def test_calculate_min_latency_all_none(monitor_instance):
    monitor_instance.latency_history_real_values = [None, None, None]
    assert monitor_instance._calculate_min_latency() is None

def test_calculate_min_latency_single_value(monitor_instance):
    monitor_instance.latency_history_real_values = [15.5]
    assert monitor_instance._calculate_min_latency() == 15.5

def test_calculate_min_latency_multiple_values(monitor_instance):
    monitor_instance.latency_history_real_values = [20.0, 10.0, 30.0]
    assert monitor_instance._calculate_min_latency() == 10.0

def test_calculate_min_latency_with_nones(monitor_instance):
    monitor_instance.latency_history_real_values = [20.0, None, 10.0, None, 30.0]
    assert monitor_instance._calculate_min_latency() == 10.0


def test_calculate_max_latency_empty(monitor_instance):
    monitor_instance.latency_history_real_values = []
    assert monitor_instance._calculate_max_latency() is None

def test_calculate_max_latency_all_none(monitor_instance):
    monitor_instance.latency_history_real_values = [None, None, None]
    assert monitor_instance._calculate_max_latency() is None

def test_calculate_max_latency_single_value(monitor_instance):
    monitor_instance.latency_history_real_values = [25.0]
    assert monitor_instance._calculate_max_latency() == 25.0

def test_calculate_max_latency_multiple_values(monitor_instance):
    monitor_instance.latency_history_real_values = [10.0, 30.0, 20.0]
    assert monitor_instance._calculate_max_latency() == 30.0

def test_calculate_max_latency_with_nones(monitor_instance):
    monitor_instance.latency_history_real_values = [10.0, None, 30.0, None, 20.0]
    assert monitor_instance._calculate_max_latency() == 30.0

# --- Tests for main() Argument Parsing and Validation ---

def test_main_default_args(mocker):
    """Test main() uses default arguments when none are provided."""
    mocker.patch('sys.argv', ['monitor_net.py'])
    mock_monitor_class = mocker.patch('monitor_net.NetworkMonitor')
    mock_sys_exit = mocker.patch('sys.exit')

    main()

    mock_monitor_class.assert_called_once()
    call_args_list = mock_monitor_class.call_args_list
    args_passed_to_constructor = call_args_list[0][0][0]

    assert args_passed_to_constructor.host == DEFAULT_HOST_ARG
    assert args_passed_to_constructor.interval == DEFAULT_PING_INTERVAL_SECONDS_ARG
    assert args_passed_to_constructor.ymax == DEFAULT_GRAPH_Y_MAX_ARG
    assert args_passed_to_constructor.yticks == DEFAULT_Y_TICKS_ARG
    mock_sys_exit.assert_not_called()

def test_main_custom_args(mocker):
    """Test main() passes custom arguments correctly."""
    custom_args_list = [
        'monitor_net.py', 'testhost.com',
        '-i', '0.7',
        '--ymax', '180',
        '--yticks', '4'
    ]
    mocker.patch('sys.argv', custom_args_list)
    mock_monitor_class = mocker.patch('monitor_net.NetworkMonitor')
    mocker.patch('sys.exit')

    main()

    mock_monitor_class.assert_called_once()
    call_args_list = mock_monitor_class.call_args_list
    args_passed_to_constructor = call_args_list[0][0][0]
    assert args_passed_to_constructor.host == 'testhost.com'
    assert args_passed_to_constructor.interval == 0.7
    assert args_passed_to_constructor.ymax == 180.0
    assert args_passed_to_constructor.yticks == 4

def test_main_invalid_interval(mocker):
    """Test main() exits with error for invalid interval."""
    mocker.patch('sys.argv', ['monitor_net.py', '--interval', '0'])
    mock_monitor_class = mocker.patch('monitor_net.NetworkMonitor')
    mock_sys_exit = mocker.patch('sys.exit', side_effect=SystemExit)
    mocker.patch('builtins.print')

    with pytest.raises(SystemExit):
        main()

    mock_sys_exit.assert_called_once_with(EXIT_CODE_ERROR)
    mock_monitor_class.assert_not_called()

def test_main_invalid_ymax(mocker):
    """Test main() exits with error for invalid ymax."""
    mocker.patch('sys.argv', ['monitor_net.py', '--ymax', '-50'])
    mock_monitor_class = mocker.patch('monitor_net.NetworkMonitor')
    mock_sys_exit = mocker.patch('sys.exit', side_effect=SystemExit)
    mocker.patch('builtins.print')

    with pytest.raises(SystemExit):
        main()

    mock_sys_exit.assert_called_once_with(EXIT_CODE_ERROR)
    mock_monitor_class.assert_not_called()

def test_main_invalid_yticks(mocker):
    """Test main() exits with error for invalid yticks."""
    mocker.patch('sys.argv', ['monitor_net.py', '--yticks', '1'])
    mock_monitor_class = mocker.patch('monitor_net.NetworkMonitor')
    mock_sys_exit = mocker.patch('sys.exit', side_effect=SystemExit)
    mocker.patch('builtins.print')

    with pytest.raises(SystemExit):
        main()

    mock_sys_exit.assert_called_once_with(EXIT_CODE_ERROR)
    mock_monitor_class.assert_not_called()

# --- Integration Test for run() method ---

# Custom exception to break the run loop in tests (if needed, but standard exceptions work)
# class TestLoopExit(Exception):
#     pass

def test_network_monitor_run_loop_basic_iterations(monitor_instance, mocker):
    """
    Tests that the run() method executes a few loop iterations,
    calling its core components as expected and capturing logged exceptions.
    """
    # Latency values: 1 success, then an exception to stop
    latency_values_for_test = [10.0]
    num_expected_data_points = len(latency_values_for_test)

    mock_measure_latency = mocker.patch.object(monitor_instance, '_measure_latency', autospec=True)

    # Configure side_effect for _measure_latency
    # Return values from latency_values_for_test, then raise IndexError
    # This IndexError will be caught by the generic except block in run()
    side_effect_sequence = latency_values_for_test + [IndexError("Simulated loop break")]
    mock_measure_latency.side_effect = side_effect_sequence

    # Mock other methods called within the loop
    mock_update_display = mocker.patch.object(monitor_instance, '_update_display_and_status', autospec=True)
    mock_setup_terminal = mocker.patch.object(monitor_instance, '_setup_terminal', autospec=True)
    mock_restore_terminal = mocker.patch.object(monitor_instance, '_restore_terminal', autospec=True)
    mock_time_sleep = mocker.patch('time.sleep', autospec=True)
    mock_sys_exit = mocker.patch('sys.exit', side_effect=SystemExit)

    # Capture arguments to logger.exception, including exception type and value
    logged_exception_details = []
    # Keep a reference to the original mock that was set up in the fixture,
    # so we can restore it or call it if needed.
    # original_logger_exception_method = monitor_instance.logger.exception

    def capture_exception_details_with_exc_info(msg, *args, **kwargs):
        # This side_effect function is called when monitor_instance.logger.exception()
        # is invoked by the code under test.
        # We capture the arguments and, importantly, current exception info.
        exc_type, exc_value, _ = sys.exc_info() # Get current exception being handled
        detail = {
            "msg": msg,
            "type": str(exc_type) if exc_type else "None",
            "value": str(exc_value) if exc_value else "None"
        }
        logged_exception_details.append(detail)
        # If we wanted the original mock to still do its work (e.g., if it had other assertions):
        # original_logger_exception_method(msg, *args, **kwargs)

    # Replace the original logger's exception method (which is a MagicMock from fixture)
    # with a new MagicMock that uses our capturing side_effect.
    monitor_instance.logger.exception = MagicMock(
        side_effect=capture_exception_details_with_exc_info
    )

    # Call the run method, expecting it to be exited by an exception
    # caught by its generic `except Exception:` block, leading to `sys.exit`.
    with pytest.raises(SystemExit):
        monitor_instance.run()

    # Assertions
    mock_setup_terminal.assert_called_once()
    mock_restore_terminal.assert_called_once()

    # Verify that sys.exit was called (due to the caught exception in run())
    mock_sys_exit.assert_called_once_with(EXIT_CODE_ERROR)

    # Verify logger.exception was called
    monitor_instance.logger.exception.assert_called_once()

    # This print statement is for debugging via the tool's output.
    # It will show what exception was captured by the logger.
    print(f"DEBUG_AGENT: Captured exception details by logger: {logged_exception_details}")

    # Assert that the generic message was logged.
    assert len(logged_exception_details) == 1
    assert logged_exception_details[0]["msg"] == "An unexpected or critical error occurred in run loop"
    # We can add more assertions here about logged_exception_details[0]["type"]
    # and logged_exception_details[0]["value"] once we know the actual exception.

    # These assertions will likely still fail if an unexpected exception occurs early,
    # but the printed details above are the primary goal of this debugging step.
    # Expected calls: one for each item in latency_values_for_test, plus one that raises IndexError
    expected_measure_latency_calls = num_expected_data_points + 1
    assert mock_measure_latency.call_count == expected_measure_latency_calls

    # _update_display_and_status should be called for each data point processed
    assert mock_update_display.call_count == num_expected_data_points

    # Check time.sleep calls
    assert mock_time_sleep.call_count == num_expected_data_points
    expected_sleep_calls = [call(monitor_instance.ping_interval)] * num_expected_data_points
    if num_expected_data_points > 0 : # Only assert if sleep was expected to be called
        mock_time_sleep.assert_has_calls(expected_sleep_calls)

    # Verify the state of latency lists
    expected_history_real = latency_values_for_test
    expected_plot_values = [val if val is not None else 0.0 for val in latency_values_for_test]

    assert monitor_instance.latency_history_real_values == expected_history_real
    assert monitor_instance.latency_plot_values == expected_plot_values

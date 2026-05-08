import 'dart:async';
import 'dart:convert';

import 'package:flutter/foundation.dart';

class PitchGame extends ChangeNotifier {
  Timer? _interval;

  int _outCount = 0;
  int _hitsCount = 0;
  int _walkCount = 0;

  int _totalBallCount = 0;
  int _totalStrikeCount = 0;

  int _currentBallCount = 0;
  int _currentStrikeCount = 0;

  int _strikePercentage = 0;
  int _ballPercentage = 0;

  DateTime? gameStarted;
  Duration? lastTime;

  int get batterCount => _outCount + _hitsCount + _walkCount;
  int get outCount => _outCount;
  int get walkCount => _walkCount;
  int get hitsCount => _hitsCount;
  int get onBase => _walkCount + _hitsCount;

  int get runCount => (onBase - 3) > 0 ? (onBase - 3) : 0;

  int get totalBalls => _totalBallCount;
  int get totalStrikes => _totalStrikeCount;
  int get totalPitches => _totalBallCount + _totalStrikeCount + _hitsCount;

  int get currentBalls => _currentBallCount;
  int get currentStrikes => _currentStrikeCount;

  int get strikePercentage => _strikePercentage;
  int get ballPercentage => _ballPercentage;

  void toggleTimer() {
    if (gameStarted == null) {
      gameStarted = DateTime.now();
      _interval = Timer.periodic(const Duration(seconds: 1), (timer) {
        if (gameStarted != null) {
          notifyListeners();
        }
      });
    } else {
      lastTime = getDuration();
      gameStarted = null;
      _interval?.cancel();
    }
    notifyListeners();
  }

  bool isTimerRunning() => gameStarted != null;

  Duration getDuration() {
    if (isTimerRunning()) {
      return DateTime.now().toUtc().difference(gameStarted!.toUtc());
    }
    if (lastTime != null) {
      return lastTime!;
    }
    return Duration();
  }

  String getFormattedDuration() {
    return getDuration().toString().split('.').first.padLeft(8, "0");
  }

  void _updateStats() {
    if (totalPitches > 0) {
      _strikePercentage = (100 * (_totalStrikeCount / totalPitches)).round();
      _ballPercentage = (100 * (_totalBallCount / totalPitches)).round();
    } else {
      _strikePercentage = _ballPercentage = 0;
    }
  }

  void incrementHit() {
    _hitsCount++;
    _currentBallCount = _currentStrikeCount = 0;
    _updateStats();
  }

  void incrementBall() {
    _totalBallCount++;
    _currentBallCount++;

    if (_currentBallCount == 4) {
      _walkCount++;
      _currentBallCount = _currentStrikeCount = 0;
    }

    _updateStats();
  }

  void incrementStrike() {
    _totalStrikeCount++;
    _currentStrikeCount++;

    if (_currentStrikeCount == 3) {
      _outCount++;
      _currentBallCount = _currentStrikeCount = 0;
    }

    _updateStats();
  }

  void resetCounters() {
    _outCount = 0;
    _hitsCount = 0;
    _walkCount = 0;
    _totalBallCount = 0;
    _totalStrikeCount = 0;
    _currentBallCount = 0;
    _currentStrikeCount = 0;
    _strikePercentage = 0;
    _ballPercentage = 0;
    gameStarted = null;
    _updateStats();
  }

  /// Export game data as JSON string
  String exportToJson() {
    return jsonEncode({
      'timestamp': gameStarted?.toIso8601String() ?? DateTime.now().toIso8601String(),
      'ballCount': _totalBallCount,
      'strikeCount': _totalStrikeCount,
      'hitCount': _hitsCount,
      'walkCount': _walkCount,
      'outCount': _outCount,
      'pitchCount': totalPitches,
      'strikePercentage': _strikePercentage,
      'ballPercentage': _ballPercentage,
    });
  }

  /// Export game data as CSV string
  String exportToCsv() {
    return 'Timestamp,Ball Count,Strike Count,Hit Count,Walk Count,Out Count,Pitch Count,Strike %,Ball %\n'
        '${gameStarted ?? DateTime.now()},'
        '$_totalBallCount,'
        '$_totalStrikeCount,'
        '$_hitsCount,'
        '$_walkCount,'
        '$_outCount,'
        '$totalPitches,'
        '$_strikePercentage,'
        '$_ballPercentage';
  }
}

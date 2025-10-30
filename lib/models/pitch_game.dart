import 'dart:collection';
import 'package:flutter/foundation.dart';

class PitchGame extends ChangeNotifier {
  int _outCount = 0;
  int _hitsCount = 0;
  int _walkCount = 0;
  int _batterCount = 1;
  
  int _totalBallCount = 0;
  int _totalStrikeCount = 0;
  
  int _currentBallCount = 0;
  int _currentStrikeCount = 0;

  int _strikePercentage = 0;
  int _ballPercentage = 0;

  int get batterCount => _batterCount;
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

  // Stats
  int get strikePercentage => _strikePercentage;
  int get ballPercentage => _ballPercentage;



  void _updateStats() {
    if (totalPitches > 0) {
      _strikePercentage = (100 * (_totalStrikeCount / totalPitches)).round();
      _ballPercentage = (100 * (_totalBallCount / totalPitches)).round();
    } else {
      _strikePercentage = _ballPercentage = 0;
    }

    notifyListeners();
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
      _batterCount++;
      _currentBallCount = _currentStrikeCount = 0;
    }

    _updateStats();
  }

  void incrementStrike() {
    _totalStrikeCount++;
    _currentStrikeCount++;

    if (_currentStrikeCount == 3) {
      _outCount++;
      _batterCount++;
      _currentBallCount = _currentStrikeCount = 0;
    }

    _updateStats();
  }

  void resetCounters() {
    _outCount = 0;
    _hitsCount = 0;
    _walkCount = 0;
    _batterCount = 1;
    _totalBallCount = 0;
    _totalStrikeCount = 0;
    _currentBallCount = 0;
    _currentStrikeCount = 0;
    _strikePercentage = 0;
    _ballPercentage = 0;

    _updateStats();
  }
}

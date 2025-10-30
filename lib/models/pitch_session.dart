import 'dart:collection';
import 'package:flutter/foundation.dart';

class PitchSession extends ChangeNotifier {
  int _outCount = 0;
  int _ballCount = 0;
  int _strikeCount = 0;
  int _spotHit = 0;
  int _pitchCount = 0;

  int _spotPercentage = 0;
  int _strikePercentage = 0;
  int _ballPercentage = 0;



  int get outCount => _outCount;
  /// The current total price of all items (assuming all items cost $42).
  int get ballCount => _ballCount;
  int get strikeCount => _strikeCount;
  int get spotHit => _spotHit;
  int get pitchCount => _pitchCount;

  // Stats
  int get spotPercentage => _spotPercentage;
  int get strikePercentage => _strikePercentage;
  int get ballPercentage => _ballPercentage;



  void _updateStats() {
    if (_pitchCount > 0) {
      _spotPercentage = (100 * (_spotHit / _pitchCount)).round();
      _strikePercentage = (100 * (_strikeCount / _pitchCount)).round();
      _ballPercentage = (100 * (_ballCount / _pitchCount)).round();
    } else {
      _spotPercentage = _strikePercentage = _ballPercentage = 0;
    }

    notifyListeners();
  }


  void _incrementPitchCount() {
    _pitchCount++;
    _updateStats();
  }

  void incrementBall() {
    _ballCount++;
    _incrementPitchCount();
  }

  void incrementStrike() {
    _strikeCount++;
    _incrementPitchCount();
  }

  void incrementSpot() {
    _strikeCount++;
    _spotHit++;
    _incrementPitchCount();
  }

  void resetCounters() {
    _strikeCount = _ballCount = _pitchCount = _outCount = _spotHit = 0;
    _updateStats();
  }

  void incrementOuts() {
    _outCount++;
    _updateStats();
  }
}

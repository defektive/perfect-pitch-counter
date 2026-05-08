import 'package:flutter/foundation.dart';

class ArbitraryCounter extends ChangeNotifier {
  final String name;
  final String id;
  int _count = 0;
  int _totalIncrements = 0;
  DateTime? _lastUsed;

  ArbitraryCounter(this.name) : id = '${DateTime.now().millisecondsSinceEpoch}_${++_nextId}';

  int get count => _count;
  int get totalIncrements => _totalIncrements;
  DateTime? get lastUsed => _lastUsed;
  bool get hasBeenUsed => _totalIncrements > 0;

  void increment() {
    _count++;
    _totalIncrements++;
    _lastUsed = DateTime.now();
    notifyListeners();
  }

  void decrement() {
    if (_count > 0) {
      _count--;
      _lastUsed = DateTime.now();
      notifyListeners();
    }
  }

  void reset() {
    _count = 0;
    _lastUsed = DateTime.now();
    notifyListeners();
  }

  set count(int value) {
    _count = value;
    notifyListeners();
  }

  set totalIncrements(int value) {
    _totalIncrements = value;
    notifyListeners();
  }

  set lastUsed(DateTime? value) {
    _lastUsed = value;
    notifyListeners();
  }
}

int _nextId = 1;

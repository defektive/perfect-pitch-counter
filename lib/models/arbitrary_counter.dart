import 'package:flutter/foundation.dart';

class ArbitraryCounter extends ChangeNotifier {
  final String name;
  final String id;
  int _count = 0;

  static int _nextId = 1;
  ArbitraryCounter(this.name) : id = '${_nextId++}';

  int get count => _count;

  void increment() {
    _count++;
    notifyListeners();
  }

  void decrement() {
    if (_count > 0) {
      _count--;
      notifyListeners();
    }
  }

  void reset() {
    _count = 0;
    notifyListeners();
  }
}

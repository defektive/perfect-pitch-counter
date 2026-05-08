import 'package:flutter/foundation.dart';
import 'arbitrary_counter.dart';

class CounterManager extends ChangeNotifier {
  final List<ArbitraryCounter> _counters = [];

  List<ArbitraryCounter> get counters => List.unmodifiable(_counters);
  int get totalCount => _counters.fold(0, (sum, c) => sum + c.count);

  void addCounter(String name) {
    if (name.isEmpty) {
      throw ArgumentError('Counter name cannot be empty');
    }
    if (name.length > 50) {
      throw ArgumentError('Counter name cannot exceed 50 characters');
    }
    if (_counters.any((c) => c.name.toLowerCase() == name.toLowerCase())) {
      throw ArgumentError('Counter with name "$name" already exists');
    }

    final counter = ArbitraryCounter(name);
    _counters.add(counter);
    notifyListeners();
  }

  void incrementCounter(ArbitraryCounter counter) {
    counter.increment();
    notifyListeners();
  }

  void decrementCounter(ArbitraryCounter counter) {
    counter.decrement();
    notifyListeners();
  }

  void resetCounter(ArbitraryCounter counter) {
    counter.reset();
    notifyListeners();
  }

  void removeCounter(ArbitraryCounter counter) {
    _counters.remove(counter);
    notifyListeners();
  }

  void resetAll() {
    for (final counter in _counters) {
      counter.reset();
    }
    notifyListeners();
  }
}

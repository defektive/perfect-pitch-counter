import 'package:flutter/foundation.dart';
import 'arbitrary_counter.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

class CounterManager extends ChangeNotifier {
  CounterManager._privateConstructor();

  static CounterManager? _instance;

  factory CounterManager() {
    _instance ??= CounterManager._privateConstructor();
    return _instance!;
  }

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
    _saveCounters();
  }

  void incrementCounter(ArbitraryCounter counter) {
    counter.increment();
    notifyListeners();
    _saveCounters();
  }

  void decrementCounter(ArbitraryCounter counter) {
    counter.decrement();
    notifyListeners();
    _saveCounters();
  }

  void resetCounter(ArbitraryCounter counter) {
    counter.reset();
    notifyListeners();
    _saveCounters();
  }

  void removeCounter(ArbitraryCounter counter) {
    _counters.remove(counter);
    notifyListeners();
    _saveCounters();
  }

  void resetAll() {
    for (final counter in _counters) {
      counter.reset();
    }
    notifyListeners();
    _saveCounters();
  }

  Future<void> _saveCounters() async {
    final prefs = await SharedPreferences.getInstance();
    final countersJson = <String, Map<String, dynamic>>{};
    for (final counter in _counters) {
      countersJson[counter.id] = {
        'name': counter.name,
        'count': counter.count,
        'totalIncrements': counter.totalIncrements,
      };
    }
    await prefs.setString('counters', json.encode(countersJson));
  }

  Future<void> loadCounters() async {
    final prefs = await SharedPreferences.getInstance();
    final json = prefs.getString('counters');
    if (json == null) return;

    final map = Map<String, dynamic>.from(jsonDecode(json));
    _counters.clear();
    for (final entry in map.entries) {
      final counter = ArbitraryCounter(entry.value['name']);
      counter.count = entry.value['count'] as int;
      counter.totalIncrements = entry.value['totalIncrements'] as int;
      _counters.add(counter);
    }
    notifyListeners();
  }

  void loadCountersSync() {
    try {
      loadCounters().then((_) {});
    } catch (_) {}
  }
}

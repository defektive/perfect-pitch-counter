import 'package:flutter_test/flutter_test.dart';
import 'package:pitch_counter/models/arbitrary_counter.dart';

void main() {
  group('ArbitraryCounter', () {
    test('generates unique ID', () {
      final counter1 = ArbitraryCounter('Test1');
      final counter2 = ArbitraryCounter('Test2');
      expect(counter1.id, isNot(equals(counter2.id)));
    });

    test('starts with count 0', () {
      final counter = ArbitraryCounter('Test');
      expect(counter.count, equals(0));
    });

    test('increment increases count', () {
      final counter = ArbitraryCounter('Test');
      counter.increment();
      expect(counter.count, equals(1));
      counter.increment();
      expect(counter.count, equals(2));
    });

    test('decrement decreases count', () {
      final counter = ArbitraryCounter('Test');
      counter.increment();
      counter.increment();
      expect(counter.count, equals(2));
      counter.decrement();
      expect(counter.count, equals(1));
    });

    test('cannot decrement when count is 0', () {
      final counter = ArbitraryCounter('Test');
      counter.decrement();
      expect(counter.count, equals(0));
    });

    test('reset sets count to 0', () {
      final counter = ArbitraryCounter('Test');
      counter.increment();
      counter.increment();
      counter.reset();
      expect(counter.count, equals(0));
    });

    test('notifyListeners on increment', () {
      var listenerCalled = false;
      final counter = ArbitraryCounter('Test');
      counter.addListener(() => listenerCalled = true);
      counter.increment();
      expect(listenerCalled, isTrue);
    });

    test('notifyListeners on decrement', () {
      var listenerCalled = false;
      final counter = ArbitraryCounter('Test');
      counter.addListener(() => listenerCalled = true);
      counter.increment();
      counter.decrement();
      expect(listenerCalled, isTrue);
    });

    test('notifyListeners on reset', () {
      var listenerCalled = false;
      final counter = ArbitraryCounter('Test');
      counter.addListener(() => listenerCalled = true);
      counter.reset();
      expect(listenerCalled, isTrue);
    });

    test('hasBeenUsed is false initially', () {
      final counter = ArbitraryCounter('Test');
      expect(counter.hasBeenUsed, isFalse);
    });

    test('hasBeenUsed becomes true after increment', () {
      final counter = ArbitraryCounter('Test');
      counter.increment();
      expect(counter.hasBeenUsed, isTrue);
    });

    test('totalIncrements tracks all increments', () {
      final counter = ArbitraryCounter('Test');
      expect(counter.totalIncrements, equals(0));
      counter.increment();
      expect(counter.totalIncrements, equals(1));
      counter.decrement();
      expect(counter.totalIncrements, equals(1)); // not decremented
      counter.increment();
      expect(counter.totalIncrements, equals(2));
    });

    test('name is stored correctly', () {
      final counter = ArbitraryCounter('My Counter');
      expect(counter.name, equals('My Counter'));
    });
  });
}

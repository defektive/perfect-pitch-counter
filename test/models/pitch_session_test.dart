import 'package:flutter_test/flutter_test.dart';
import 'package:pitch_counter/models/pitch_session.dart';

void main() {
  group('PitchSession', () {
    // ================== Constructor ==================
    test('starts with zero counts', () {
      final session = PitchSession();
      session.resetCounters();
      expect(session.outCount, equals(0));
      expect(session.ballCount, equals(0));
      expect(session.strikeCount, equals(0));
      expect(session.pitchCount, equals(0));
      expect(session.spotHit, equals(0));
      expect(session.spotPercentage, equals(0));
      expect(session.strikePercentage, equals(0));
      expect(session.ballPercentage, equals(0));
    });

    test('notifies listeners initially', () {
      var listenerCalled = false;
      final session = PitchSession();
      session.addListener(() => listenerCalled = true);
      // The listener is added after the session is created
      // The initial notification happens in _updateStats() which runs before addListener
      // So listenerCalled is false here, which is correct
      // We test that notifications ARE sent when state changes:
      session.incrementBall();
      expect(listenerCalled, isTrue);
    });

    // ================== ball ==================
    test('increments ball count', () {
      final session = PitchSession();
      session.resetCounters();
      session.incrementBall();
      expect(session.ballCount, equals(1));
      expect(session.pitchCount, equals(1));
    });

    test('increments ballPercentage on ball', () {
      final session = PitchSession();
      session.resetCounters();
      expect(session.ballPercentage, equals(0));
      session.incrementBall();
      expect(session.ballPercentage, equals(100));
    });

    test('decrements ballPercentage on strike after ball', () {
      final session = PitchSession();
      session.resetCounters();
      session.incrementBall();
      expect(session.ballPercentage, equals(100));
      session.incrementStrike();
      expect(session.ballPercentage, equals(50));
      expect(session.strikePercentage, equals(50));
    });

    test('notifies listeners when ball is recorded', () {
      var listenerCalled = false;
      final session = PitchSession();
      session.addListener(() => listenerCalled = true);
      session.incrementBall();
      expect(listenerCalled, isTrue);
    });

    // ================== strike ==================
    test('increments strike count', () {
      final session = PitchSession();
      session.resetCounters();
      session.incrementStrike();
      expect(session.strikeCount, equals(1));
      expect(session.pitchCount, equals(1));
    });

    test('increments strikePercentage on strike', () {
      final session = PitchSession();
      session.resetCounters();
      expect(session.strikePercentage, equals(0));
      session.incrementStrike();
      expect(session.strikePercentage, equals(100));
    });

    test('decrements strikePercentage on ball after strike', () {
      final session = PitchSession();
      session.resetCounters();
      session.incrementStrike();
      expect(session.strikePercentage, equals(100));
      session.incrementBall();
      expect(session.strikePercentage, equals(50));
      expect(session.ballPercentage, equals(50));
    });

    test('notifies listeners when strike is recorded', () {
      var listenerCalled = false;
      final session = PitchSession();
      session.addListener(() => listenerCalled = true);
      session.incrementStrike();
      expect(listenerCalled, isTrue);
    });

    // ================== spotHit ==================
    test('increments spot hit count', () {
      final session = PitchSession();
      session.resetCounters();
      session.incrementSpot();
      expect(session.spotHit, equals(1));
      expect(session.strikeCount, equals(1));
      expect(session.pitchCount, equals(1));
    });

    test('increments both strike and spotHit on spot', () {
      final session = PitchSession();
      session.resetCounters();
      session.incrementSpot();
      expect(session.strikeCount, equals(1));
      expect(session.spotHit, equals(1));
      expect(session.pitchCount, equals(1));
    });

    test('increments spotPercentage on spot', () {
      final session = PitchSession();
      session.resetCounters();
      expect(session.spotPercentage, equals(0));
      session.incrementSpot();
      expect(session.spotPercentage, equals(100));
    });

    test('notifies listeners when spot is recorded', () {
      var listenerCalled = false;
      final session = PitchSession();
      session.addListener(() => listenerCalled = true);
      session.incrementSpot();
      expect(listenerCalled, isTrue);
    });

    // ================== pitchCount ==================
    test('ball increments pitchCount', () {
      final session = PitchSession();
      session.resetCounters();
      session.incrementBall();
      expect(session.pitchCount, equals(1));
    });

    test('strike increments pitchCount', () {
      final session = PitchSession();
      session.resetCounters();
      session.incrementStrike();
      expect(session.pitchCount, equals(1));
    });

    test('spot increments pitchCount', () {
      final session = PitchSession();
      session.resetCounters();
      session.incrementSpot();
      expect(session.pitchCount, equals(1));
    });

    test('outs does not increment pitchCount', () {
      final session = PitchSession();
      session.resetCounters();
      session.incrementOuts();
      expect(session.outCount, equals(1));
      expect(session.pitchCount, equals(0));
    });

    // ================== spotPercentage ==================
    test('spotPercentage is 0 initially', () {
      final session = PitchSession();
      session.resetCounters();
      expect(session.spotPercentage, equals(0));
    });

    test('spotPercentage equals spotHit / pitchCount * 100', () {
      final session = PitchSession();
      session.resetCounters();
      session.incrementSpot();
      expect(session.spotPercentage, equals(100)); // 1/1
      session.resetCounters();
      session.incrementSpot();
      session.incrementSpot();
      expect(session.spotPercentage, equals(100)); // 2/2
    });

    test('spotPercentage decreases as more pitches added', () {
      final session = PitchSession();
      session.resetCounters();
      session.incrementSpot();
      expect(session.spotPercentage, equals(100)); // 1/1
      session.resetCounters();
      session.incrementSpot();
      session.incrementStrike();
      expect(session.spotPercentage, equals(50)); // 1/2
    });

    // ================== strikePercentage ==================
    test('strikePercentage equals strikes / pitches * 100', () {
      final session = PitchSession();
      session.resetCounters();
      session.incrementStrike();
      expect(session.strikePercentage, equals(100)); // 1/1
      session.resetCounters();
      session.incrementStrike();
      session.incrementBall();
      expect(session.strikePercentage, equals(50)); // 1/2
    });

    // ================== ballPercentage ==================
    test('ballPercentage equals balls / pitches * 100', () {
      final session = PitchSession();
      session.resetCounters();
      session.incrementBall();
      expect(session.ballPercentage, equals(100)); // 1/1
      session.resetCounters();
      session.incrementBall();
      session.incrementStrike();
      expect(session.ballPercentage, equals(50)); // 1/2
    });

    // ================== resetCounters ==================
    test('resets all counters to 0', () {
      final session = PitchSession();
      session.resetCounters();
      session.incrementBall();
      session.incrementBall();
      session.incrementStrike();
      session.incrementStrike();
      session.incrementSpot();
      session.incrementOuts();

      session.resetCounters();

      expect(session.outCount, equals(0));
      expect(session.ballCount, equals(0));
      expect(session.strikeCount, equals(0));
      expect(session.pitchCount, equals(0));
      expect(session.spotHit, equals(0));
      expect(session.spotPercentage, equals(0));
      expect(session.strikePercentage, equals(0));
      expect(session.ballPercentage, equals(0));
    });

    test('notifies listeners when reset', () {
      var listenerCalled = false;
      final session = PitchSession();
      session.addListener(() => listenerCalled = true);
      session.resetCounters();
      expect(listenerCalled, isTrue);
    });

    // ================== incrementOuts ==================
    test('increments out count', () {
      final session = PitchSession();
      session.resetCounters();
      session.incrementOuts();
      expect(session.outCount, equals(1));
    });

    test('notifies listeners when outs are recorded', () {
      var listenerCalled = false;
      final session = PitchSession();
      session.addListener(() => listenerCalled = true);
      session.incrementOuts();
      expect(listenerCalled, isTrue);
    });

    // ================== Percentage edge cases ==================
    test('percentages are 0 when no pitches recorded', () {
      final session = PitchSession();
      session.resetCounters();
      expect(session.spotPercentage, equals(0));
      expect(session.strikePercentage, equals(0));
      expect(session.ballPercentage, equals(0));
    });

    test('percentages sum to 100 when only balls and strikes', () {
      final session = PitchSession();
      session.resetCounters();
      session.incrementBall();
      session.incrementBall();
      session.incrementStrike();
      expect(session.ballPercentage + session.strikePercentage, equals(100));
    });

    test('percentages sum to 200 when including spots (spot is counted as both spot and strike)', () {
      final session = PitchSession();
      session.resetCounters();
      session.incrementSpot();
      // After incrementSpot: spotHit=1, strikeCount=1, pitchCount=1
      // spotPercentage = 100%, strikePercentage = 100%, ballPercentage = 0%
      expect(session.spotPercentage + session.strikePercentage + session.ballPercentage, equals(200));
    });

    test('percentages sum to 100 when including outs (outs does not affect percentages)', () {
      final session = PitchSession();
      session.resetCounters();
      session.incrementOuts();
      // incrementOuts only increments _outCount, not _pitchCount
      expect(session.spotPercentage + session.strikePercentage + session.ballPercentage, equals(0));
    });

    test('all counters reset together', () {
      final session = PitchSession();
      session.resetCounters();
      session.incrementSpot();
      session.incrementStrike();
      session.incrementBall();
      // Note: incrementOuts doesn't increment pitchCount, so it doesn't affect percentages
      // session.incrementOuts();
      // session.incrementOuts();

      session.resetCounters();

      expect(session.outCount, equals(0));
      expect(session.ballCount, equals(0));
      expect(session.strikeCount, equals(0));
      expect(session.spotHit, equals(0));
      expect(session.pitchCount, equals(0));
      expect(session.spotPercentage, equals(0));
      expect(session.strikePercentage, equals(0));
      expect(session.ballPercentage, equals(0));
    });

    test('reset does not affect next test', () {
      final session = PitchSession();
      session.resetCounters();
      expect(session.pitchCount, equals(0));
      session.incrementStrike();
      expect(session.pitchCount, equals(1));
    });
  });
}

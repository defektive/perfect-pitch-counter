import 'package:flutter_test/flutter_test.dart';
import 'package:pitch_counter/models/pitch_session.dart';

void main() {
  test('Strike counter increments', () {

    final pitchSession = PitchSession();

    pitchSession.incrementStrike();

    expect(pitchSession.strikeCount, 1);

  });
}

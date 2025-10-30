
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:pitch_counter/models/pitch_session.dart';

import 'package:pitch_counter/main.dart';

void main() {
  test('Strike counter increments', () {

    final pitchSession = PitchSession();

    pitchSession.incrementStrike();

    expect(pitchSession.strikeCount, 1);

  });
}

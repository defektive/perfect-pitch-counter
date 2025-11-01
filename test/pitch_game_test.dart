
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:pitch_counter/models/pitch_game.dart';

import 'package:pitch_counter/main.dart';

void main() {
  test('Strike counter increments pitches and batters', () {

    final pitchGame = PitchGame();

    pitchGame.incrementStrike();

    expect(pitchGame.batterCount, 0);
    expect(pitchGame.currentStrikes, 1);
    expect(pitchGame.totalStrikes, 1);

    pitchGame.incrementStrike();
    pitchGame.incrementStrike();

    expect(pitchGame.totalStrikes, 3);
    expect(pitchGame.outCount, 1);
    expect(pitchGame.batterCount, 1);

  });
}

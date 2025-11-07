import 'package:flutter/material.dart';

import '../models/pitch_game.dart';

class PitchGamePage extends StatefulWidget {
  const PitchGamePage({super.key});

  @override
  State<PitchGamePage> createState() => _PitchGamePageState();
}

class _PitchGamePageState extends State<PitchGamePage> {
  PitchGame pitchGame = PitchGame();

  Scaffold appPage() {
    debugPrint('Host device screen width: ${pitchGame.currentStrikes}');

    return Scaffold(
      body: ListView(
        children: <Widget>[
          ListTile(
            title: Text('Practice time'),
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              // Important for multiple widgets in Row
              children: <Widget>[
                Padding(
                  padding: EdgeInsets.only(left: 20, right: 20),
                  child: Text(
                    pitchGame.getFormattedDuration(),
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 15.0, // Sets the font size in logical pixels
                    ),
                  ),
                ),
                ElevatedButton(
                  onPressed: pitchGame.toggleTimer,
                  child: Icon(
                    pitchGame.isTimerRunning()
                        ? Icons.stop
                        : Icons.play_arrow,
                  ),
                ),
              ],
            ),
          ),
          Divider(height: 0),
          ListTile(
            title: Text('Hits'),
            subtitle: Text('Number of hits'),
            trailing: ElevatedButton(
              onPressed: pitchGame.incrementHit,
              child: Text('${pitchGame.hitsCount}'),
            ),
          ),
          Divider(height: 0),
          ListTile(
            title: Text('Strikes'),
            subtitle: Text('Pitches inside the strike zone'),
            trailing: ElevatedButton(
                  onPressed: pitchGame.incrementStrike,
                  child: Text('${pitchGame.currentStrikes}'),
                ),
          ),
          Divider(height: 0),
          ListTile(
            title: Text('Balls'),
            subtitle: Text('Pitches out side the strike zone'),
            trailing: ElevatedButton(
              onPressed: pitchGame.incrementBall,
              child: Text('${pitchGame.currentBalls}'),
            ),
          ),
          Divider(height: 0),
          ListTile(
            trailing: CircleAvatar(child: Text('${pitchGame.batterCount}')),
            title: Text('Batters'),
            subtitle: Text('Number of batters'),
          ),
          Divider(height: 0),
          ListTile(
            trailing: CircleAvatar(child: Text('${pitchGame.outCount}')),
            title: Text('Outs'),
            subtitle: Text('Number of outs'),
          ),
          Divider(height: 0),
          ListTile(
            trailing: CircleAvatar(child: Text('${pitchGame.walkCount}')),
            title: Text('Walks'),
            subtitle: Text('Number of walks'),
          ),
          Divider(height: 0),
          ListTile(
            trailing: CircleAvatar(child: Text('${pitchGame.runCount}')),
            title: Text('Runs'),
            subtitle: Text('Number of runs'),
          ),
          Divider(height: 0),
          ListTile(
            trailing: CircleAvatar(child: Text('${pitchGame.totalStrikes}')),
            title: Text('Strikes'),
            subtitle: Text('Number of strikes'),
          ),
          Divider(height: 0),
          ListTile(
            trailing: CircleAvatar(child: Text('${pitchGame.totalBalls}')),
            title: Text('Balls'),
            subtitle: Text('Number of balls'),
          ),
          Divider(height: 0),
          ListTile(
            trailing: CircleAvatar(child: Text('${pitchGame.totalPitches}')),
            title: Text('Pitches'),
            subtitle: Text('Number of pitches'),
          ),
          Divider(height: 0),
          ListTile(
            title: Text('Reset'),
            subtitle: Text('Reset stats'),
            trailing: ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red, // Background color for the danger button
                foregroundColor: Colors.white, // Text color for the danger button
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8), // Rounded corners
                ),
              ),
              onPressed: pitchGame.resetCounters,
              child: const Icon(Icons.refresh),
            ),
          ),
          Divider(height: 0),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: pitchGame,
      builder: (context, child) {
        return appPage();
      },
    );
  }
}

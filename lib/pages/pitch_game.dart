import 'package:flutter/material.dart';

import '../models/pitch_game.dart';

class PitchGamePage extends StatefulWidget {
  const PitchGamePage({super.key});

  @override
  State<PitchGamePage> createState() => _PitchGamePageState();
}

class _PitchGamePageState extends State<PitchGamePage> {
  final pitchGame = PitchGame();

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
          ListTile(
            title: Text('Hits'),
            subtitle: Text('Number of hits'),
            trailing: ElevatedButton(
              onPressed: pitchGame.incrementHit,
              child: Text('${pitchGame.hitsCount}'),
            ),
          ),
          ListTile(
            title: Text('Strikes'),
            subtitle: Text('Pitches inside the strike zone'),
            trailing: ElevatedButton(
                  onPressed: pitchGame.incrementStrike,
                  child: Text('${pitchGame.currentStrikes}'),
                ),
          ),
          ListTile(
            title: Text('Balls'),
            subtitle: Text('Pitches out side the strike zone'),
            trailing: ElevatedButton(
              onPressed: pitchGame.incrementBall,
              child: Text('${pitchGame.currentBalls}'),
            ),
          ),
          ListTile(
            trailing: CircleAvatar(child: Text('${pitchGame.batterCount}')),
            title: Text('Batters'),
            subtitle: Text('Number of batters'),
          ),
          ListTile(
            trailing: CircleAvatar(child: Text('${pitchGame.outCount}')),
            title: Text('Outs'),
            subtitle: Text('Number of outs'),
          ),
          ListTile(
            trailing: CircleAvatar(child: Text('${pitchGame.walkCount}')),
            title: Text('Walks'),
            subtitle: Text('Number of walks'),
          ),
          ListTile(
            trailing: CircleAvatar(child: Text('${pitchGame.runCount}')),
            title: Text('Runs'),
            subtitle: Text('Number of runs'),
          ),
        ],
      ),

      floatingActionButton: FloatingActionButton(
        onPressed: pitchGame.resetCounters,
        tooltip: 'Reset',
        child: const Icon(Icons.refresh),
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

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
            leading: CircleAvatar(child: Text('${pitchGame.hitsCount}')),
            title: Text('Hits'),
            subtitle: Text('Number of hits'),
            trailing: ElevatedButton(
              onPressed: pitchGame.incrementHit,
              child: Icon(Icons.add),
            ),
          ),
          ListTile(
            leading: CircleAvatar(child: Text('${pitchGame.currentStrikes}')),
            title: Text('Strikes'),
            subtitle: Text('Pitches inside the strike zone'),
            trailing: ElevatedButton(
              onPressed: pitchGame.incrementStrike,
              child: Icon(Icons.add),
            ),
          ),
          ListTile(
            leading: CircleAvatar(child: Text('${pitchGame.currentBalls}')),
            title: Text('Balls'),
            subtitle: Text('Pitches out side the strike zone'),
            trailing: ElevatedButton(
              onPressed: pitchGame.incrementBall,
              child: Icon(Icons.add),
            ),
          ),
          ListTile(
            leading: CircleAvatar(child: Text('${pitchGame.outCount}')),
            title: Text('Outs'),
            subtitle: Text('Number of outs'),
          ),
          ListTile(
            leading: CircleAvatar(child: Text('${pitchGame.walkCount}')),
            title: Text('Walks'),
            subtitle: Text('Number of walks'),
          ),
          ListTile(
            leading: CircleAvatar(child: Text('${pitchGame.runCount}')),
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
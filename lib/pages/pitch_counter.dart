import 'package:flutter/material.dart';
import 'package:pitch_counter/models/pitch_game.dart';
import '../models/pitch_session.dart';

class PitchCounterPage extends StatefulWidget {
  const PitchCounterPage({super.key});


  @override
  State<PitchCounterPage> createState() => _PitchCounterPageState();
}

class _PitchCounterPageState extends State<PitchCounterPage> {

  PitchGame pitchGame = PitchGame();


  // final pitchSession = PitchSession();

  Scaffold appPage() {
    return Scaffold(
      body: ListView(
        children: <Widget>[

          ListTile(
            title: Text('Strikes'),
            subtitle: Text('Pitches in the strike zone'),
            trailing: ElevatedButton(
              onPressed: pitchGame.incrementStrike,
              child:  Text('${pitchGame.totalStrikes}'),
            ),
          ),
          ListTile(
            title: Text('Balls'),
            subtitle: Text('Pitches outside the strike zone'),
            trailing: ElevatedButton(
              onPressed: pitchGame.incrementBall,
              child: Text('${pitchGame.totalBalls}'),
            ),
          ),
          ListTile(
            title: Text('Outs'),
            subtitle: Text('Number of outs'),
            trailing: CircleAvatar(child: Text('${pitchGame.outCount}')),
          ),
          Divider(height: 0),
          ListTile(
            title: Text('Pitch Stats'),
            subtitle: Text(
              'Strikes: ${pitchGame.strikePercentage}% Balls: ${pitchGame.ballPercentage}%',
            ),
          ),
          Divider(height: 0),
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
    return  ListenableBuilder(
      listenable: pitchGame,
      builder: (context, child) {
          return appPage();
        // }
      },
    );
  }
}


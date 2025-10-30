import 'package:flutter/material.dart';
import '../models/pitch_session.dart';

class PitchCounterPage extends StatefulWidget {
  const PitchCounterPage({super.key});


  @override
  State<PitchCounterPage> createState() => _PitchCounterPageState();
}

class _PitchCounterPageState extends State<PitchCounterPage> {

  final pitchSession = PitchSession();

  Scaffold appPage() {
    return Scaffold(
      body: ListView(
        children: <Widget>[
          ListTile(
            leading: CircleAvatar(child: Text('${pitchSession.spotHit}')),
            title: Text('Spot Hit'),
            subtitle: Text('Pitches with successful spot hits'),
            trailing: ElevatedButton(
              onPressed: pitchSession.incrementSpot,
              child: Icon(Icons.add),
            ),
          ),
          ListTile(
            leading: CircleAvatar(child: Text('${pitchSession.strikeCount}')),
            title: Text('Strikes'),
            subtitle: Text('Pitches in the strike zone'),
            trailing: ElevatedButton(
              onPressed: pitchSession.incrementStrike,
              child: Icon(Icons.add),
            ),
          ),
          ListTile(
            leading: CircleAvatar(child: Text('${pitchSession.ballCount}')),
            title: Text('Balls'),
            subtitle: Text('Pitches outside the strike zone'),
            trailing: ElevatedButton(
              onPressed: pitchSession.incrementBall,
              child: Icon(Icons.add),
            ),
          ),
          ListTile(
            leading: CircleAvatar(child: Text('${pitchSession.outCount}')),
            title: Text('Outs'),
            subtitle: Text('Number of outs'),
            trailing: ElevatedButton(
              onPressed: pitchSession.incrementOuts,
              child: Icon(Icons.add),
            ),
          ),
          Divider(height: 0),
          ListTile(
            leading: CircleAvatar(child: Text('${pitchSession.pitchCount}')),
            title: Text('Pitches Stats'),
            subtitle: Text(
              'Spots: ${pitchSession.spotPercentage}% Strikes: ${pitchSession.strikePercentage}% Balls: ${pitchSession.ballPercentage}%',
            ),
          ),
          Divider(height: 0),
        ],
      ),

      floatingActionButton: FloatingActionButton(
        onPressed: pitchSession.resetCounters,
        tooltip: 'Reset',
        child: const Icon(Icons.refresh),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return  ListenableBuilder(
      listenable: pitchSession,
      builder: (context, child) {
          return appPage();
        // }
      },
    );
  }
}


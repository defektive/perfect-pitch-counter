import 'package:flutter/material.dart';
import 'package:wear_plus/wear_plus.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Perfect Pitch Counter',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.teal),
      ),
      home: const PitchCounterPage(title: 'Perfect Pitch Counter'),
    );
  }
}

class PitchCounterPage extends StatefulWidget {
  const PitchCounterPage({super.key, required this.title});

  final String title;

  @override
  State<PitchCounterPage> createState() => _PitchCounterPageState();
}

class _PitchCounterPageState extends State<PitchCounterPage> {
  int _outCount = 0;
  int _ballCount = 0;
  int _strikeCounter = 0;
  int _spotHit = 0;
  int _pitchCount = 0;

  int _spotPercentage = 0;
  int _strikePercentage = 0;
  int _ballPercentage = 0;

  void _updateStats() {
    setState(() {
      if (_pitchCount > 0) {
        _spotPercentage = (100 * (_spotHit / _pitchCount)).round();
        _strikePercentage = (100 * (_strikeCounter / _pitchCount)).round();
        _ballPercentage = (100 * (_ballCount / _pitchCount)).round();
      } else {
        _spotPercentage = _strikePercentage = _ballPercentage = 0;
      }
    });
  }

  void _incrementBall() {
    setState(() {
      _ballCount++;
      _pitchCount++;
    });
    _updateStats();
  }

  void _incrementStrike() {
    setState(() {
      _strikeCounter++;
      _pitchCount++;
    });
    _updateStats();
  }

  void _incrementSpot() {
    setState(() {
      _strikeCounter++;
      _spotHit++;
      _pitchCount++;
    });
    _updateStats();
  }

  void _resetCounters() {
    setState(() {
      _strikeCounter = _ballCount = _pitchCount = _outCount = _spotHit = 0;
    });
    _updateStats();
  }

  void _incrementOuts() {
    setState(() {
      _outCount++;
    });
    _updateStats();
  }

  Scaffold watchPage() {
    return Scaffold(
      body: WatchShape(
          builder: (context, shape, child) {
            return AmbientMode(
              builder: (context, mode, child) {
                return MediaQuery.removePadding(
                  context: context,
                  removeTop: true,
                  child: GridView.count(
                    crossAxisCount: 2,

                    // Generate 100 widgets that display their index in the list.
                    children: <Widget>[
                      ElevatedButton(
                        onPressed: _incrementSpot,
                        child: Text('Spot: $_spotHit'),
                        style: ElevatedButton.styleFrom(
                          shape: const RoundedRectangleBorder(
                            borderRadius:
                            BorderRadius.zero, // Set borderRadius to zero
                          ),
                          alignment: Alignment.bottomRight,
                          padding: EdgeInsets.fromLTRB(0, 0, 10, 5),
                        ),
                      ),
                      ElevatedButton(
                        onPressed: _incrementStrike,
                        child: Text('Strike: $_strikeCounter'),
                        style: ElevatedButton.styleFrom(
                          shape: const RoundedRectangleBorder(
                            borderRadius:
                            BorderRadius.zero, // Set borderRadius to zero
                          ),
                          alignment: Alignment.bottomLeft,
                          padding: EdgeInsets.fromLTRB(10, 0, 0, 5),
                        ),
                      ),
                      ElevatedButton(
                        onPressed: _incrementBall,
                        child: Text('Balls: $_ballCount'),
                        style: ElevatedButton.styleFrom(
                          shape: const RoundedRectangleBorder(
                            borderRadius:
                            BorderRadius.zero, // Set borderRadius to zero
                          ),
                          alignment: Alignment.topRight,
                          padding: EdgeInsets.fromLTRB(0, 5, 10, 0),
                        ),
                      ),
                      ElevatedButton(
                        onPressed: _resetCounters,
                        child: Text('Reset: $_pitchCount'),
                        style: ElevatedButton.styleFrom(
                          shape: const RoundedRectangleBorder(
                            borderRadius:
                            BorderRadius.zero, // Set borderRadius to zero
                          ),
                          alignment: Alignment.topLeft,
                          padding: EdgeInsets.fromLTRB(10, 5, 0, 0),
                        ),
                      ),
                    ],
                  ),
                );
              },
            );
          }
      ),
    );
  }

  Scaffold appPage() {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme
            .of(context)
            .colorScheme
            .inversePrimary,
        title: Text(widget.title),
      ),
      body: ListView(
        children: <Widget>[
          ListTile(
            leading: CircleAvatar(child: Text('$_spotHit')),
            title: Text('Spot Hit'),
            subtitle: Text('Pitches with successful spot hits'),
            trailing: ElevatedButton(
              onPressed: _incrementSpot,
              child: Icon(Icons.add),
            ),
          ),
          ListTile(
            leading: CircleAvatar(child: Text('$_strikeCounter')),
            title: Text('Strikes'),
            subtitle: Text('Pitches in the strike zone'),
            trailing: ElevatedButton(
              onPressed: _incrementStrike,
              child: Icon(Icons.add),
            ),
          ),
          ListTile(
            leading: CircleAvatar(child: Text('$_ballCount')),
            title: Text('Balls'),
            subtitle: Text('Pitches outside the strike zone'),
            trailing: ElevatedButton(
              onPressed: _incrementBall,
              child: Icon(Icons.add),
            ),
          ),
          ListTile(
            leading: CircleAvatar(child: Text('$_outCount')),
            title: Text('Outs'),
            subtitle: Text('Number of outs'),
            trailing: ElevatedButton(
              onPressed: _incrementOuts,
              child: Icon(Icons.add),
            ),
          ),
          Divider(height: 0),
          ListTile(
            leading: CircleAvatar(child: Text('$_pitchCount')),
            title: Text('Pitches Stats'),
            subtitle: Text(
              'Spots: $_spotPercentage% Strikes: $_strikePercentage% Balls: $_ballPercentage%',
            ),
          ),
          Divider(height: 0),
        ],
      ),

      floatingActionButton: FloatingActionButton(
        onPressed: _resetCounters,
        tooltip: 'Reset',
        child: const Icon(Icons.refresh),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        debugPrint('Host device screen width: ${constraints.maxWidth}');

        // Watch-sized device
        if (constraints.maxWidth < 300) {
          return watchPage();
        }
        // Phone-sized device
        else {
          return appPage();
        }
      },
    );
  }
}


import 'package:flutter/material.dart';

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
      body: GridView.count(
        crossAxisCount: 2,
        padding: const EdgeInsets.all(8),
        childAspectRatio: 2,
        children: <Widget>[
          ElevatedButton(
            onPressed: _incrementSpot,
            style: ElevatedButton.styleFrom(
              shape: const RoundedRectangleBorder(
                borderRadius: BorderRadius.zero,
              ),
              alignment: Alignment.bottomRight,
              padding: const EdgeInsets.fromLTRB(0, 0, 10, 5),
            ),
            child: Text('Spot: $_spotHit'),
          ),
          ElevatedButton(
            onPressed: _incrementStrike,
            style: ElevatedButton.styleFrom(
              shape: const RoundedRectangleBorder(
                borderRadius: BorderRadius.zero,
              ),
              alignment: Alignment.bottomLeft,
              padding: const EdgeInsets.fromLTRB(10, 0, 0, 5),
            ),
            child: Text('Strike: $_strikeCounter'),
          ),
          ElevatedButton(
            onPressed: _incrementBall,
            style: ElevatedButton.styleFrom(
              shape: const RoundedRectangleBorder(
                borderRadius: BorderRadius.zero,
              ),
              alignment: Alignment.topRight,
              padding: const EdgeInsets.fromLTRB(0, 5, 10, 0),
            ),
            child: Text('Balls: $_ballCount'),
          ),
          ElevatedButton(
            onPressed: _resetCounters,
            style: ElevatedButton.styleFrom(
              shape: const RoundedRectangleBorder(
                borderRadius: BorderRadius.zero,
              ),
              alignment: Alignment.topLeft,
              padding: const EdgeInsets.fromLTRB(10, 5, 0, 0),
            ),
            child: Text('Reset: $_pitchCount'),
          ),
        ],
      ),
    );
  }

  Scaffold appPage() {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(widget.title),
      ),
      body: ListView(
        children: <Widget>[
          ListTile(
            leading: CircleAvatar(child: Text('$_spotHit')),
            title: const Text('Spot Hit'),
            subtitle: const Text('Pitches with successful spot hits'),
            trailing: ElevatedButton(
              onPressed: _incrementSpot,
              child: const Icon(Icons.add),
            ),
          ),
          ListTile(
            leading: CircleAvatar(child: Text('$_strikeCounter')),
            title: const Text('Strikes'),
            subtitle: const Text('Pitches in the strike zone'),
            trailing: ElevatedButton(
              onPressed: _incrementStrike,
              child: const Icon(Icons.add),
            ),
          ),
          ListTile(
            leading: CircleAvatar(child: Text('$_ballCount')),
            title: const Text('Balls'),
            subtitle: const Text('Pitches outside the strike zone'),
            trailing: ElevatedButton(
              onPressed: _incrementBall,
              child: const Icon(Icons.add),
            ),
          ),
          ListTile(
            leading: CircleAvatar(child: Text('$_outCount')),
            title: const Text('Outs'),
            subtitle: const Text('Number of outs'),
            trailing: ElevatedButton(
              onPressed: _incrementOuts,
              child: const Icon(Icons.add),
            ),
          ),
          const Divider(height: 0),
          ListTile(
            leading: CircleAvatar(child: Text('$_pitchCount')),
            title: const Text('Pitches Stats'),
            subtitle: Text(
              'Spots: $_spotPercentage% Strikes: $_strikePercentage% Balls: $_ballPercentage%',
            ),
          ),
          const Divider(height: 0),
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
    return appPage();
  }
}

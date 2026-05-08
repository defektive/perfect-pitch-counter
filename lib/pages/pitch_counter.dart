import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:pitch_counter/models/pitch_game.dart';

class PitchCounterPage extends StatefulWidget {
  const PitchCounterPage({super.key});


  @override
  State<PitchCounterPage> createState() => _PitchCounterPageState();
}

class _PitchCounterPageState extends State<PitchCounterPage> {
  late final PitchGame _pitchGame = PitchGame();

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: _pitchGame,
      builder: (context, child) {
        return Scaffold(
          body: ListView(
            children: <Widget>[
              ListTile(
                title: const Text('Strikes'),
                subtitle: const Text('Pitches in the strike zone'),
                trailing: ElevatedButton(
                  onPressed: _pitchGame.incrementStrike,
                  child: Text('${_pitchGame.totalStrikes}'),
                ),
              ),
              ListTile(
                title: const Text('Balls'),
                subtitle: const Text('Pitches outside the strike zone'),
                trailing: ElevatedButton(
                  onPressed: _pitchGame.incrementBall,
                  child: Text('${_pitchGame.totalBalls}'),
                ),
              ),
              ListTile(
                title: const Text('Outs'),
                subtitle: const Text('Number of outs'),
                trailing: CircleAvatar(child: Text('${_pitchGame.outCount}')),
              ),
              const Divider(height: 0),
              ListTile(
                title: const Text('Pitch Stats'),
                subtitle: Text(
                  'Strikes: ${_pitchGame.strikePercentage}% Balls: ${_pitchGame.ballPercentage}%',
                ),
              ),
              const Divider(height: 0),
            ],
          ),
          floatingActionButton: FloatingActionButton(
            onPressed: _showExportDialog,
            tooltip: 'Export',
            child: const Icon(Icons.download),
          ),
        );
      },
    );
  }

  void _showExportDialog() {
    showModalBottomSheet(
      context: context,
      builder: (context) => Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Export Data'),
            const SizedBox(height: 8),
            ListTile(
              leading: const Icon(Icons.insert_drive_file),
              title: const Text('JSON'),
              onTap: () {
                final json = _pitchGame.exportToJson();
                _copyToClipboard(json);
                Navigator.pop(context);
              },
            ),
            ListTile(
              leading: const Icon(Icons.table_chart),
              title: const Text('CSV'),
              onTap: () {
                final csv = _pitchGame.exportToCsv();
                _copyToClipboard(csv);
                Navigator.pop(context);
              },
            ),
            const SizedBox(height: 8),
            ElevatedButton(
              onPressed: () {
                final json = _pitchGame.exportToJson();
                final csv = _pitchGame.exportToCsv();
                final text = '\n\n--- JSON ---\n$json\n\n--- CSV ---\n$csv';
                _copyToClipboard(text);
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Data copied to clipboard!')),
                );
                Navigator.pop(context);
              },
              child: const Text('Copy All'),
            ),
          ],
        ),
      ),
    );
  }

  void _copyToClipboard(String text) {
    Clipboard.setData(ClipboardData(text: text));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Copied to clipboard!'),
        duration: Duration(seconds: 2),
      ),
    );
  }
}

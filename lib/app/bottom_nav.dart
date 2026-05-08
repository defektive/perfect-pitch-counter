import 'package:flutter/material.dart';
import 'package:pitch_counter/models/pitch_game.dart';
import 'package:pitch_counter/pages/pitch_game.dart';
import 'package:pitch_counter/pages/pitch_counter.dart';
import 'package:pitch_counter/pages/arbitrary_counters.dart';

import '../config/labels.dart';
import '../pages/settings.dart';

class BottomNav extends StatefulWidget {
  const BottomNav({super.key});

  @override
  State<BottomNav> createState() =>
      _BottomNavState();
}

class _BottomNavState extends State<BottomNav> {
  int _selectedIndex = 0;
  PitchGame _pitchGame = PitchGame();
  static const List<Widget> _widgetOptions = <Widget>[
    PitchGamePage(),
    PitchCounterPage(),
    ArbitraryCountersPage(),
    SettingsPage(title: "settings"),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          backgroundColor: Theme
              .of(context)
              .colorScheme
              .inversePrimary,
          title: const Text(AppTitle)
      ),
      body: Center(child: _widgetOptions.elementAt(_selectedIndex)),
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.sports_baseball),
            label: 'Game Mode',
          ),
          BottomNavigationBarItem(icon: Icon(Icons.dashboard), label: 'Counter Mode'),
          BottomNavigationBarItem(icon: Icon(Icons.list_alt), label: 'Counters'),
          BottomNavigationBarItem(icon: Icon(Icons.settings), label: 'Settings'),
        ],
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.amber[800],
        backgroundColor: Theme.of(context).scaffoldBackgroundColor,
        type: BottomNavigationBarType.fixed,
        unselectedItemColor: Theme.of(context).hintColor,
        onTap: _onItemTapped,
      ),
    );
  }
}

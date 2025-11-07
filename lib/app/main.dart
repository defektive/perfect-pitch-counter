
import 'package:flutter/material.dart';
import 'package:pitch_counter/pages/pitch_counter.dart';

import 'bottom_nav.dart';

class PitchCounterApp extends StatelessWidget {
  const PitchCounterApp({super.key});

  bool isDarkMode(BuildContext context) {
    return MediaQuery.of(context).platformBrightness == Brightness.dark;
  }

  @override
  Widget build(BuildContext context) {

    final bool systemIsDarkMode = isDarkMode(context);

    return MaterialApp(
      title: 'Perfect Pitch Counter',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.grey, brightness: (systemIsDarkMode ? Brightness.dark : Brightness.light), contrastLevel: 0.05),
      ),
      home: const BottomNav(),
    );
  }
}
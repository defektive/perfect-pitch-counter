
import 'package:flutter/material.dart';
import 'package:pitch_counter/pages/pitch_counter.dart';

import 'bottom_nav.dart';

class PitchCounterApp extends StatelessWidget {
  const PitchCounterApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Perfect Pitch Counter',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.teal),
      ),
      home: const BottomNav(),
    );
  }
}
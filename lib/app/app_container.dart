
import 'package:flutter/material.dart';
import 'package:pitch_counter/pages/pitch_counter.dart';

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
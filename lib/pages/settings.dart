import 'dart:io';

import 'package:flutter/material.dart';
import 'package:package_info_plus/package_info_plus.dart';


class SettingsPage extends StatefulWidget {
  const SettingsPage({super.key, required this.title});

  final String title;

  @override
  State<SettingsPage> createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  PackageInfo _packageInfo = PackageInfo(
    appName: 'Unknown',
    packageName: 'Unknown',
    version: 'Unknown',
    buildNumber: 'Unknown',
    buildSignature: 'Unknown',
    installerStore: 'Unknown',
  );

  @override
  void initState() {
    super.initState();
    _initPackageInfo();
  }

  Future<void> _initPackageInfo() async {
    final info = await PackageInfo.fromPlatform();
    setState(() {
      _packageInfo = info;
    });
  }

  Scaffold appPage() {
    return Scaffold(
      body: ListView(
        children: <Widget>[
          ListTile(
            leading: Icon(Icons.text_fields),
            title: Text('Application'),
            trailing: Text(_packageInfo.appName),
          ),
          Divider(height: 0),
          ListTile(
            leading: Icon(Icons.info),
            title: Text('Version'),
            trailing: Text(_packageInfo.version),
          ),
          Divider(height: 0),
          ListTile(
            leading:  Icon(Icons.handyman),
            title: Text('Build Number'),
              trailing: Text(_packageInfo.buildNumber)
          ),
          Divider(height: 0),
        ],
      ),

    );
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
          return appPage();
      },
    );
  }
}


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

  Widget _appPage() {
    return Scaffold(
      appBar: AppBar(title: Text(widget.title)),
      body: ListView(
        children: <Widget>[
          ListTile(
            leading: const Icon(Icons.text_fields),
            title: const Text('Application'),
            trailing: Text(_packageInfo.appName),
          ),
          const Divider(height: 0),
          ListTile(
            leading: const Icon(Icons.info),
            title: const Text('Version'),
            trailing: Text(_packageInfo.version),
          ),
          const Divider(height: 0),
          ListTile(
            leading: const Icon(Icons.settings),
            title: const Text('Build Number'),
            trailing: Text(_packageInfo.buildNumber),
          ),
          const Divider(height: 0),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return _appPage();
  }
}

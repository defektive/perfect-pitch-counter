import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/counter_manager.dart';
import '../models/arbitrary_counter.dart';

class ArbitraryCountersPage extends StatefulWidget {
  const ArbitraryCountersPage({super.key});

  @override
  State<ArbitraryCountersPage> createState() => _ArbitraryCountersPageState();
}

class _ArbitraryCountersPageState extends State<ArbitraryCountersPage> {
  final _counterManager = CounterManager();
  final _nameController = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider.value(
      value: _counterManager,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Counters'),
          actions: [
            IconButton(
              icon: const Icon(Icons.delete_sweep),
              tooltip: 'Reset All',
              onPressed: _counterManager.resetAll,
            ),
          ],
        ),
        body: Consumer<CounterManager>(
          builder: (context, manager, child) {
            return manager.counters.isEmpty
                ? const Center(
                    child: Text(
                      'No counters added. Tap + to add one.',
                      style: TextStyle(color: Colors.grey),
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(8),
                    itemBuilder: (context, index) {
                      return _buildCounterTile(manager.counters[index]);
                    },
                    itemCount: manager.counters.length,
                  );
          },
        ),
        floatingActionButton: FloatingActionButton.extended(
          onPressed: _showAddCounterDialog,
          tooltip: 'Add Counter',
          icon: const Icon(Icons.add),
          label: const Text('Add'),
        ),
      ),
    );
  }

  Widget _buildCounterTile(ArbitraryCounter counter) {
    return ListTile(
      key: ValueKey(counter.id),
      leading: Text(
        counter.name,
        style: const TextStyle(
          fontWeight: FontWeight.bold,
          fontSize: 18,
        ),
      ),
      title: Container(
        width: 50,
        height: 50,
        decoration: BoxDecoration(
          color: Colors.grey[800],
          borderRadius: BorderRadius.circular(25),
        ),
        child: Center(
          child: Text(
            counter.count.toString(),
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
      trailing: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          IconButton(
            icon: const Icon(Icons.remove),
            onPressed: counter.count > 0
                ? () => _counterManager.decrementCounter(counter)
                : null,
          ),
          const SizedBox(width: 4),
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => _counterManager.incrementCounter(counter),
          ),
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => _counterManager.resetCounter(counter),
          ),
          IconButton(
            icon: const Icon(Icons.delete, color: Colors.red),
            onPressed: () => _showRemoveDialog(counter),
          ),
        ],
      ),
      onTap: () => _showRemoveDialog(counter),
    );
  }

  void _showAddCounterDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Add New Counter'),
        content: Form(
          key: _formKey,
          child: TextFormField(
            controller: _nameController,
            decoration: const InputDecoration(
              labelText: 'Counter Name',
              hintText: 'e.g., Jumps, Sprints',
            ),
            validator: (value) {
              if (value == null || value.isEmpty) {
                return 'Please enter a name';
              }
              return null;
            },
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: _addCounter,
            child: const Text('Add'),
          ),
        ],
      ),
    );
  }

  void _addCounter() {
    if (_formKey.currentState!.validate()) {
      _counterManager.addCounter(_nameController.text.trim());
      _nameController.clear();
      Navigator.pop(context);
    }
  }

  void _showRemoveDialog(ArbitraryCounter counter) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Remove Counter'),
        content: Text('${counter.name} will be deleted permanently.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              _counterManager.removeCounter(counter);
              Navigator.pop(context);
            },
            child: const Text('Delete'),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _nameController.dispose();
    super.dispose();
  }
}

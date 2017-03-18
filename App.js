import React from 'react';
import { StyleSheet, Text, View, Button, ListView, Alert } from 'react-native';
import Expo, { Components, Permissions } from 'expo';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      data: [],
      dataSource: ds.cloneWithRows([]),
      hasCameraPermission: null,
      scannerOn: false,
    };
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasCameraPermission: status === 'granted'});
  }

  openScanner = () => {
    if (this.state.hasCameraPermission) {
      this.setState(prev => ({ scannerOn: true }));
    } else {
      Alert.alert('No access to camera');
    }
  }

  handleScanner = scannerData => {
    this.setState(prev => {
      const data = prev.data.concat(scannerData.data);

      Alert.alert(JSON.stringify(Components.BarCodeScanner.BarCodeTypes));

      return {
        data,
        dataSource: prev.dataSource.cloneWithRows(data),
        scannerOn: false,
      }
    });
  }

  render() {
    let contents;
    if (this.state.hasCameraPermission && this.state.scannerOn) {
      contents = (
        <Components.BarCodeScanner
          onBarCodeRead={this.handleScanner}
          style={StyleSheet.absoluteFill}
          barCodeTypes={['ean13']}
        />
      );
    } else {
      contents = (
        <View style={{ marginTop: 50 }}>
          <Button
            title="Scan"
            onPress={this.openScanner}
          />
          <ListView
            dataSource={this.state.dataSource}
            renderRow={(rowData) => <Text>{rowData}</Text>}
            enableEmptySections
          />
        </View>
      );
    }

    return (
    <View style={styles.container}>
      {contents}
    </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

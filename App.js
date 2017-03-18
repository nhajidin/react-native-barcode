// @flow
import React from 'react';
import { StyleSheet, Text, View, Button, ListView, Alert, type ListViewDataSource } from 'react-native';
import Expo, { Components, Permissions } from 'expo'; // eslint-disable-line no-unused-vars

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});

type ScannerData = {
  type: string,
  data: string,
}

type Props = {
};

export default class App extends React.Component {
  props: Props;

  state: {
    data: Array<string>,
    dataSource: ListViewDataSource,
    hasCameraPermission: boolean | null,
    scannerOn: boolean,
  };

  constructor(props: Props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
    });

    this.state = {
      data: [],
      dataSource: ds.cloneWithRows([]),
      hasCameraPermission: null,
      scannerOn: false,
    };
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  openScanner = () => {
    if (this.state.hasCameraPermission) {
      this.setState({ scannerOn: true });
    } else {
      Alert.alert('No access to camera');
    }
  };

  handleScanner = (scannerData: ScannerData) => {
    this.setState(prev => {
      const data = prev.data.concat(scannerData.data);

      return {
        data,
        dataSource: prev.dataSource.cloneWithRows(data),
        scannerOn: false,
      };
    });
  };

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
          <Button title="Scan" onPress={this.openScanner} />
          <ListView
            dataSource={this.state.dataSource}
            renderRow={rowData => <Text>{rowData}</Text>}
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

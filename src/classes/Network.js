class Network {
  static user = 0;
  static channel = 0;
  static token = 0;
  static latest = 0;
  static urlPrefix = 'https://sse.nodehill.com';

  static startConnection(_user, _channel, listener) {

    Network.user = _user
    Network.channel = _channel;

    const eventSource = new EventSource(Network.urlPrefix + `/api/listen/${Network.channel}/${Network.user}/${Network.latest}`);

    eventSource.addEventListener('token', event => {
      Network.token = JSON.parse(event.data);
    });

    eventSource.onmessage = event => {
      listener(JSON.parse(event.data));
    }

    eventSource.onerror = error => {
      eventSource.close();
      setTimeout(startConnection, 1000)
    }
  }

  static async send(message) {
    return await (await fetch(Network.urlPrefix + `/api/send/${Network.token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
      mode: 'cors'
    })).json();
  }

}
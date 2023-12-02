class player {
  constructor(props) {
    this.x = props.x;
    this.y = props.y;
  }

  move() {}
}

class alien {
  constructor(props) {
    this.x = props.x;
    this.y = props.y;
  }

  move() {}
}

player = new player({ x: 10, y: 10 });

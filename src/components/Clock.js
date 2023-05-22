import React, { Component } from "react";

class Clock extends Component {
    constructor(props) {
        super(props);

        this.state = { date: new Date() };
    }

    componentDidMount() {
        this.timerID = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            date: new Date()
        });
    }

    render() {
        return (
            <div>
                <h2 style={{color: "black"}}>{this.state.date.toLocaleString("en-GB", {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    second: "2-digit"
                })}</h2>
            </div>
        );
    }
}

export default Clock;

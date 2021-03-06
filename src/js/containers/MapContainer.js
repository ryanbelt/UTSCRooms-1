/* global L */

import React, { PropTypes, Component } from 'react';
import GoogleMap from 'google-map-react';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as formatTime from '../constants/timeFormat';

import * as roomsActionsCreator from '../actions/rooms';
import * as timeActionsCreator from '../actions/time';

import * as api from '../api';
import locations from '../constants/locations';

import RoomMarker from '../components/RoomMarker';

const propTypes = {
  rooms: PropTypes.object.isRequired,
  time: PropTypes.object.isRequired,
  roomsActions: PropTypes.object.isRequired,
  timeActions: PropTypes.object.isRequired,
};

class MapContainer extends Component {
  constructor(props) {
    super(props);

    this.onChildClick = this.onChildClick.bind(this);
    this.updateTime = this.updateTime.bind(this);
  }

  componentWillMount() {
    const { roomsActions } = this.props;
    this.updateTime();
    api.getRoomList(roomsActions);
    // setInterval(this.updateTime, 1000);
  }

  onChildClick(key, childProps) {
    const { roomsActions } = this.props;
    roomsActions.setCurrentRoom(childProps.roomId);
  }

  updateTime() {
    const { time, timeActions } = this.props;
    const today = new Date();
    const newDay = today.getDay() + 1;
    const newHour = 9;
    const newMinute = 50;
    // const newHour = today.getHours();
    // const newMinute = today.getMinutes();
    if (time.minute !== newMinute) timeActions.setTime(newHour, newMinute);
    if (time.day !== newDay) timeActions.setDay(newDay);
  }

  render() {
    const { rooms, time } = this.props;

    const position = { lat: 43.784606, lng: -79.186933 };
    const apiKey = 'AIzaSyDuJqmOrLGdC78AtELhhxFaSoCTspWDBWY';
    return (
      <GoogleMap
        bootstrapURLKeys={{
          apiKey,
        }}
        defaultCenter={position}
        defaultZoom={17}
        onChildClick={this.onChildClick}
      >
        {
          Object.keys(rooms.roomAvails).map(roomId => {
            const roomInfo = roomId.split('-');
            const buildingId = roomInfo[0];
            const roomNumber = roomInfo[1];
            if (locations[buildingId]) {
              if (locations[buildingId].rooms[`${buildingId}${roomNumber}`]) {
                const room = locations[buildingId].rooms[`${buildingId}${roomNumber}`];
                let available = false;
                let availUntil = 'N/A'; // eslint-disable-line

                if (rooms.roomAvails[roomId][time.currentSlot]) {
                  if (rooms.roomAvails[roomId][time.currentSlot][time.day] === '') {
                    available = true;
                    let currentSlot = formatTime.nextSlot(time.currentSlot);
                    while (
                      rooms.roomAvails[roomId][currentSlot] &&
                      rooms.roomAvails[roomId][currentSlot][time.day] === ''
                    ) {
                      currentSlot = formatTime.nextSlot(currentSlot);
                    }
                    availUntil = formatTime.formatSlot(currentSlot);
                  }
                }

                return (
                  <RoomMarker
                    key={roomId}
                    lat={room.lat}
                    lng={room.lon}
                    roomId={roomId}
                    available={available}
                    selected={rooms.currentRoom === roomId}
                  />
                );
              }
            }
            return null;
          })
        }
      </GoogleMap>
    );
  }
}

MapContainer.propTypes = propTypes;

const mapStateToProps = state => ({
  rooms: state.rooms,
  time: state.time,
});

const mapDispatchToProps = dispatch => ({
  roomsActions: bindActionCreators(roomsActionsCreator, dispatch),
  timeActions: bindActionCreators(timeActionsCreator, dispatch),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MapContainer);


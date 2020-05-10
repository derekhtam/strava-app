import React, { useContext, useState } from "react";
import { AuthContext } from "../App";
import { useCookies } from "react-cookie";
import { asyncFetch } from "../helpers/asyncFetch";
import { Box, Typography } from "@material-ui/core";

const metersToMiles = 0.000621371192;

function AthleteStats() {
  const [cookies] = useCookies();
  const context = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  let athleteStatsUrl = `https://www.strava.com/api/v3/athletes/${context.user.id}/stats`;
  if (cookies.access_token && !stats) {
    asyncFetch(athleteStatsUrl, cookies.access_token)
      .then((data) => {
        return data.json();
      })
      .then((stats) => {
        setStats(stats);
      });
    return <div>Loading Stats...</div>;
  } else {
    return (
      <React.Fragment>
        <div>
          {(stats.all_run_totals.distance * metersToMiles).toFixed(1)} miles
        </div>
      </React.Fragment>
    );
  }
}

function Clubs() {
  const [cookies] = useCookies();
  const context = useContext(AuthContext);
  const [clubs, setClubs] = useState([]);
  // const [clubMembers, setClubMembers] = useState({});
  let usersClubs = context.user.clubs;
  if (cookies.access_token && !clubs.length) {
    usersClubs.map((club) => {
      let clubDetailsUrl = `https://www.strava.com/api/v3/clubs/${club.id}`;
      return asyncFetch(clubDetailsUrl, cookies.access_token)
        .then((data) => {
          return data.json();
        })
        .then((club) => {
          if (club.member_count <= 150) {
            setClubs((clubs) => [...clubs, club]);
          }
        });
    });
    // usersClubs.map(club => {
    //   let clubMembersUrl = `https://www.strava.com/api/v3/clubs/${club.id}/members`;
    //   return asyncFetch(clubMembersUrl, cookies.access_token)
    //     .then(data => {
    //       return data.json();
    //     })
    //     .then(clubMembers => {
    //       setClubMembers({ [club.id]: clubMembers });
    //     });
    // });
  }
  return clubs.length !== 0
    ? clubs.map((club) => {
        return (
          <Box key={club.id} my={2}>
            <Typography variant="h5"> {club.name}</Typography>
            <Typography variant="body1">{`${club.city}${", "}${
              club.state
            }`}</Typography>
            <Typography variant="body1">{club.member_count} Members</Typography>
            <Typography variant="body1">{club.description}</Typography>
          </Box>
        );
      })
    : "Loading Club Details...";
}

export default function Dashboard() {
  const context = useContext(AuthContext);

  if (!context.user) {
    return "Athlete not found.";
  }
  return (
    <div>
      <div>{`${context.user.firstname}${" "}${context.user.lastname}`}</div>
      <div>{`${context.user.city}${", "}${context.user.state}`}</div>
      <AthleteStats />
      <Clubs />
    </div>
  );
}

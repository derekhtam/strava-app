import React, { useState } from "react";
import {
  Drawer,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  list: {
    width: "250px",
  },
  link: {
    textDecoration: "none",
    color: "inherit",
    background: theme.palette.common.white,
  },
}));

const items = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Profile", to: "/profile" },
  { label: "Tribes", to: "/tribes" },
];

export default function Header() {
  const classes = useStyles();
  const [showDrawer, setShowDrawer] = useState(false);
  return (
    <Box>
      <Button onClick={() => setShowDrawer(!showDrawer)} variant="text">
        MENU
      </Button>
      <Drawer
        anchor="left"
        open={showDrawer}
        onClose={() => {
          setShowDrawer(false);
        }}
      >
        <div className={classes.list} role="presentation">
          <List>
            {items.map((item) => (
              <ListItem to={item.to} button key={item.to} component={Link}>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
    </Box>
  );
}

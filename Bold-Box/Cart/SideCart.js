import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/styles';
import {
    Divider,
    Button,
    Box,
    Card,
    CardHeader,
    CardContent,
    CardMedia,
    Typography,
    SwipeableDrawer,
    IconButton,
    LinearProgress
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';

import { Grid, GridItem } from '@bigcommerce/big-design'


const useStyles = makeStyles({
    root: {
        maxWidth: '100%',
        displsy: 'flex',
    },
    list: {
        width: 500,
    },
    fullList: {
        width: 'auto',
    },
    details: {
        display: 'flex',
        flexDirection: 'row',
    },
    content: {
        flex: '1 0 auto',
    },
    controls: {
        display: 'flex',
        textAlign: 'left',
        float: 'left',
        bottom: 0,
        paddingLeft: "1rem",
        paddingBottom: "1rem",
    },
    cards: {
        width: 'auto',
    },
    media: {
        maxWidth: 'auto',
    },

});

export default function SideCart(props) {
    const classes = useStyles();
    const [open, setOpen] = useState(true)

    const handleCheckout = (items) => {

        window.location.pathname = "/checkout"
    }




    return (
        <div>
            <IconButton
                id="basket-button"
                edge="start"
                color="inherit"
                aria-label="open-drawer"
                onClick={() => setOpen(true)}
            >
            </IconButton>
            <SwipeableDrawer
                anchor={'right'}
                open={open}
                onClose={() => { }}
                onOpen={() => { }}
            >
                <div
                    className={classes.list}
                    role="presentation"
                >
                    <Card>
                        <CardHeader
                            title={<div><Typography component="h5" variant="h5" style={{ float: 'left' }} className={'product-title'}>
                                <em>COMPLETE YOUR BOX</em>
                            </Typography><Typography style={{ float: 'right' }}>
                                    <em>{props.cart.item_count} / {props.selectedBox.max_qty}</em>
                                </Typography></div>}
                        />
                        <CardContent>
                            <LinearProgress variant="determinate" value={parseInt(props.cart.item_count / props.selectedBox.max_qty * 100)} />
                        </CardContent>
                    </Card>
                    <Grid style={{ fontSize: '2rem', marginBottom: '1rem', textAlign: 'center', justifyContent: 'center' }}>
                        <GridItem style={{ fontWeight: 'bold' }}>
                            <Button variant="outlined" color="secondary" onClick={() => props.setCartOpen(false)}>
                                <ArrowBackIcon /> Keep building your box
                        </Button>
                        </GridItem>
                        <GridItem style={{ width: '100%', border: 'solid 1px #000', padding: '.5rem', }}>

                            <Grid gridColumns={`repeat(3, 1fr)`} >
                                {props.boxes.map(row => (
                                    <GridItem key={`grid-${row.name}`} >
                                        {row.name === props.selectedBox.name ?
                                            <Button variant="contained" style={{ width: '100%', backgroundColor: '#000', color: '#fff' }} onClick={() => props.handleSelectedBox(row)}>
                                                {row.max_qty} items
                                            </Button>
                                            : <Button variant="outlined" color="default" style={{ width: '100%' }} onClick={() => props.handleSelectedBox(row)}>
                                                {row.max_qty} items
                                 </Button>}

                                    </GridItem>
                                ))}
                            </Grid>
                        </GridItem>
                        <GridItem>
                            <Grid>
                                {props.cart.items.map((row, indx) => (
                                    <GridItem key={`grid-item-${row.id}`} >
                                        <Card key={`${row.id}`} className={classes.root}>
                                            <CardHeader
                                                title={<div><Typography key={"title"} style={{ float: 'left' }} className={'product-title'}>
                                                    <em>{row.title}</em> <br />
                                                </Typography><Typography key={"price"} style={{ float: 'right' }}>
                                                        ${row.price / 100}
                                                    </Typography></div>}
                                            />
                                            <Grid gridColumns="repeat(2, 1fr)">
                                                <GridItem key={`grid-item-image-${row.id}`}>
                                                    <CardMedia
                                                        component="img"
                                                        className={classes.media}
                                                        src={row.featured_image.url}
                                                        alt={row.featured_image.alt}
                                                        key={`image-${row.id}`}
                                                    />
                                                </GridItem>
                                                <GridItem key={`grid-item-actions-${row.id}`} >
                                                    <Divider />
                                                    <Grid gridAutoRows>
                                                        <CardContent key={row.name} className={classes.content}>
                                                            <GridItem key={`grid-item-actions-${row.id}`} style={{ display: 'inline-flex', marginBottom: 0 }}>
                                                                <span className={'MuiButtonBase-root'}>
                                                                    <RemoveIcon onClick={() => props.handleQntyRules(row, parseInt(row.quantity - 1))} />
                                                                </span>

                                                                <span className={'MuiButtonBase-root'}>
                                                                    <Typography data-cart-totals data-product-id={row.id}>
                                                                        {row.quantity}
                                                                    </Typography>
                                                                </span>
                                                                <span className={'MuiButtonBase-root'}>
                                                                    <AddIcon onClick={() => props.handleQntyRules(row, parseInt(row.quantity + 1))} />
                                                                </span>
                                                            </GridItem>
                                                        </CardContent>
                                                        <Divider />

                                                    </Grid>
                                                </GridItem>
                                            </Grid>
                                        </Card>
                                    </GridItem>
                                ))}
                            </Grid>
                        </GridItem>
                    </Grid>
                </div>
                <div style={{ marginBottom: 0 }}>
                    <Button variant="contained" style={{ width: '100%', backgroundColor: '#000', color: '#fff' }} onClick={() => handleCheckout(props.cart.items)}>
                        Checkout
                        </Button>
                </div>

            </SwipeableDrawer>
        </div >
    );
}
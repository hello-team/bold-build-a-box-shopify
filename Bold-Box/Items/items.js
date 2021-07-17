import React, { useState, useEffect } from "react";
import { Button, Typography, CssBaseline, Card, CardMedia, CardContent, IconButton, Input, TextField } from "@material-ui/core";
import { Grid, Form, FormGroup, GridItem, Radio } from '@bigcommerce/big-design'
import { makeStyles } from '@material-ui/styles';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import './items.css';
import { formatMoney } from 'accounting';


const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
        displsy: 'flex',
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    media: {
        height: '100%',
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: "1rem",
        paddingBottom: "1rem",
    },
    playIcon: {
        height: 38,
        width: 38,
    },
    backdrop: {
        color: '#fff',
    },
}));


export default function BoxItems(props) {
    const classes = useStyles();
    const [products, setProducts] = useState([])
    const [cartTotal, setCartTotal] = useState(0)
    const [windowSize, setWindowSize] = useState(window.innerWidth)
    const [boldItem, setBoldItem] = useState({})
    const [isDisabled, setDisabled] = useState(true)
    const [itemQty, setQty] = useState(0)

    useEffect(() => {
        if (!boldItem.id) {
            let item = props.item
            setBoldItem(item)
        }

    }, [props]);


    const changeQnty = (qty) => {
        console.log(qty, boldItem)
        let item = { ...boldItem }
        item.qty = qty

        if (item.qty >= 0 && item.qty <= props.limitQty) {
            setQty(qty)
            setBoldItem(item)
            setDisabled(false)
        }
        if (qty === 0) {
            setDisabled(true)
        }
    }


    return (
        <>
            <Card key={`${boldItem.id}`} className={classes.root}>
                <CardMedia
                    component="img"
                    className={classes.media}
                    src={boldItem.featured_image}
                    key={`image-${boldItem.id}`}

                />
                <div className={classes.details}>
                    <CardContent key={boldItem.name} className={classes.content}>
                        <div>
                            <Typography component="h5" variant="h5" className={'product-title'}>
                                {boldItem.title}
                            </Typography>
                            <br />
                            <Typography variant="subtitle1" color="textSecondary">
                                {formatMoney(boldItem.price / 100)}
                            </Typography>
                        </div>
                    </CardContent>
                    <div className={classes.controls}>
                        <Form action={"/cart/add"} method={'post'} >
                            <FormGroup>
                                <input type="hidden" name="id" value={boldItem.id} />
                            </FormGroup>
                            <FormGroup>

                            <Grid gridAutoRows>
                                    <GridItem key={`grid-item-actions-${boldItem.id}`} style={{ display: 'inline-flex', marginBottom: 0 }}>
                                        <span className={'MuiButtonBase-root'}>
                                            <RemoveIcon onClick={() => changeQnty(parseInt(boldItem.qty ? boldItem.qty : 0)- 1) } />
                                        </span>
                                            <span className={'MuiButtonBase-root'}>
                                            {boldItem.qty ? boldItem.qty  : 0}
                                            </span>
                                        <span className={'MuiButtonBase-root'}>
                                            <AddIcon onClick={() => changeQnty(parseInt(boldItem.qty ? boldItem.qty : 0)+ 1) } />
                                        </span>
                                    </GridItem>
                            </Grid>
                            </FormGroup>

                            <FormGroup>
                                <Button id={'add-to-cart'} disabled={isDisabled} variant="contained" onClick={() => {
                                    props.handleAdd(boldItem, boldItem.qty)
                                    changeQnty(parseInt(boldItem.qty ? boldItem.qty : 0)- boldItem.qty)
                                    }} style={{ backgroundColor: '#fff', borderColor: '#84dda7', color: '#84dda7', fontWeight: 'bold', marginBottom: '3rem' }}>
                                    Add To Cart
                            </Button>

                            </FormGroup>
                        </Form>


                    </div>

                </div>
            </Card>
        </>
    )

}
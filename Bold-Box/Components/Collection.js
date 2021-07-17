import React, { useState, useEffect } from "react";
import { Button, AppBar, Toolbar } from "@material-ui/core";
import { Box, Grid, Form, FormGroup, GridItem, Radio } from '@bigcommerce/big-design'
import { makeStyles } from '@material-ui/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import ChooseBox from '../Boxes/boxes'
import BoxItems from '../Items/items'
import SideCart from '../Cart/SideCart'
import { BorderColor } from "@material-ui/icons";
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  mealPlanCard: {
    display: 'flex',
    margin: 'auto',
    padding: '2rem',
    borderStyle: 'solid',
  },
  media: {
    height: '44px',
    width: '44px',
    textAlign: 'center',
    display: 'flex',
    margin: 'auto',
  },
}))


function getSteps() {
  return ['Choose plan', 'Select meals', 'Checkout'];
}


export default function Collection(props) {
  const classes = useStyles();
  const steps = getSteps();
  const [cart, setCart] = useState(null)
  const [context, setContext] = useState(null)
  const [step, setStep] = useState(0)
  const [selectedBox, setSelectedBox] = useState({})

  const [boxes, setBoxes] = useState([{ name: 'small', qty: 0, max_qty: 9, savings: 0, selected: false }, { name: 'medium', qty: 0, max_qty: 14, savings: 10, selected: false }, { name: 'large', qty: 0, max_qty: 24, savings: 20, selected: false }])

  const [variants, setVariants] = useState([])
  const [cartCount, setCartCount] = useState(0)
  const [cartOpen, setCartOpen] = useState(false)
  const [itemAdded, setItemAdded] = useState(0)
  const [limitQty, setLimitQty] = useState(0)

  useEffect(() => {

    if (variants.length === 0) {
      let vars = Object.keys(window.BOLD.subscriptions.data.platform.variantProductMap).map(x => {
        console.log(x)
        let prod = window.BOLD.subscriptions.data.platform.variantProductMap[x]
        prod.variantId = x
        return prod
      })
      setVariants(vars)

    }

  }, [props]);


  useEffect(() => {

    if (cartCount === selectedBox.max_qty) {
      setCartOpen(true)
    }
    setLimitQty(selectedBox.max_qty - cartCount)

  }, [cartCount]);

  useEffect(() => {

    (async () => {
      console.log('Log Cart');
      let cartData = await fetch('/cart.js', {
        credentials: 'include'
      }).then(function (response) {
        return response.json();
      }).then(function (myJson) {
        console.log(myJson);
        return myJson
      });
      setCart(cartData)

      setCartCount(cartData.item_count)
      console.log(cartData.item_count)

    })()

  }, [props, itemAdded]);

  console.log({ collection: props })

  const handleNewStep = (e) => {
    setStep(e)
  }

  const handleSelectedBox = (e) => {
    let items = boxes.map(box => {
      if (box.name === e.name) {
        setSelectedBox(box)
        setStep(1)
        setLimitQty(box.max_qty - cartCount)

        return { ...box, selected: true };
      } else {
        return { ...box, selected: false }
      }
    })
    setBoxes(items)
  }

  const handleAdd = (item, qty) => {
    console.log({
      item: item,
      qty: qty
    })
    let newQty = qty
    let formdata = new FormData();
    formdata.append("form_type", "product");
    formdata.append("utf8", "✓");

    formdata.append("id", parseInt(item.variantId));
    formdata.append("bsub-selling-plan-group", parseInt(item.selling_plan_groups[0].id));
    let sellingId = `bsub-selling-plan-${parseInt(item.selling_plan_groups[0].id)}`
    formdata.append(`${sellingId}`, item.selling_plan_groups[0].selling_plans[0].id);
    formdata.append(`quantity`, newQty);

    if(parseInt(newQty + selectedBox.qty) > selectedBox.max_qty){
      let fixedQty = parseInt(selectedBox.max_qty - selectedBox.qty)
      formdata.append(`quantity`, fixedQty);
    }else{
      formdata.append(`quantity`, newQty);
    }

    formdata.append(`selling_plan`, item.selling_plan_groups[0].selling_plans[0].id);

    let requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    };
if(selectedBox.qty !== selectedBox.max_qty){
  fetch("/cart/add.js", requestOptions)
  .then(response => response.json())
  .then(result => (
    setItemAdded(new Date().toLocaleTimeString())
  ))
  .catch(error => console.log('error', error));
}

  }


  const handleQntyRules = (line, newQty) => {
    console.log(line, newQty)
    let formdata = new FormData();
    formdata.append("id", line.id);

    formdata.append(`quantity`, newQty);

    let requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    };

    fetch("/cart/change.js", requestOptions)
      .then(response => response.json())
      .then(result => (
        setItemAdded(new Date().toLocaleTimeString())
      ))
      .catch(error => console.log('error', error));
  }


  return (
    <div style={{ paddingTop: '2rem', justifyContent: 'center' }}>

      <Stepper activeStep={step} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel onClick={() => handleNewStep(index)}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {cartOpen === false ?
        <AppBar position="static" style={{ padding: '1rem', backgroundColor: "#000", textAlign: 'right' }}>
          <div style={{ backgroundColor: "#000", textAlign: 'right', width: '100%' }}>

            <Button
              color="inherit"
              onClick={() => setCartOpen(true)}
              style={{ maxWidth: '15rem', padding: '1rem', borderStyle: 'solid', borderWidth: '2px', borderColor: '#fff', backgroundColor: "#000" }}>
              Your Box | {cartCount} / {selectedBox.max_qty ? selectedBox.max_qty : 0}
            </Button>
          </div>

        </AppBar>
        : <SideCart cartOpen={cartOpen} cart={cart}
          boxes={boxes}
          selectedBox={selectedBox}
          handleQntyRules={(line, newQty) => handleQntyRules(line, newQty)}
          handleSelectedBox={(val) => handleSelectedBox(val)}
          setCartOpen={(val) => setCartOpen(val)}
        />}

      {step === 0 ?
        <div style={{ alignItems: 'center' }}>
          <Grid gridColumns={`repeat(3, 1fr)`}>
            {boxes.map(row => (
              <GridItem key={`grid-${row.name}`} onClick={() => handleSelectedBox(row)}>
                <ChooseBox box={row} />
              </GridItem>
            ))}
          </Grid>
        </div>

        : ''}
      {step === 1 ?
        <div style={{ marginTop: '2rem' }}>
          <Grid gridColumns={`repeat(3, 1fr)`}>
            {variants.length !== 0 ? variants.map(row => (
              <GridItem key={`grid-${row.id}`}>
                <BoxItems item={row} limitQty={limitQty} selectedBox={selectedBox} handleAdd={(item, qty) => handleAdd(item, qty)}/>
              </GridItem>
            )) : ''}
          </Grid>
]        </div>
        : ''}
    </div>
  )

}
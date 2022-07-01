import React, { useEffect, useState } from "react";

import axios from "axios";
import moment from "moment";
import { Container, Row, Col, Button, Form, InputGroup } from "react-bootstrap";

import { stamps } from "../data/stamps";
import { weights } from "../data/weights";
import ItemValue from "./ItemValue";
import References from "./References";

const API = "https://api.metalpriceapi.com/v1/latest?api_key=";
const BASE = "&base=";
const CURRENCIES = "&currencies=";

const Calculator = () => {
  const [rates, setRates] = useState();
  const [base, setBase] = useState("USD");
  const [currency, setCurrency] = useState("XAU,XAG,XPD,XPT"); // XAU = Gold, XAG = Silver, XPT = Platinum, XPD = Palladium
  const [selectedStamp, setSelectedStamp] = useState(stamps[0]);
  const [selectedWeight, setSelectedWeight] = useState(weights[0]);
  const [weight, setWeight] = useState(0);
  const [itemValue, setItemValue] = useState(0);
  const [buttonDisabledFlag, setButtonDisabledFlag] = useState(false);
  const delayOfHouse = 6;
  const test = true;

  const checkStorage = () => {
    const savedRates = JSON.parse(localStorage.getItem("currentRates"));
    if (savedRates) setRates(savedRates);
    else getPrices();
  };

  const convertWeight = (weight, conversion) => {
    return weight * conversion;
  };

  const handleClick = () => {
    checkStorage();
    getPrices();
  };

  const handleStampChange = (e) => {
    const stampData = stamps.find(
      (stamp) => stamp.code === e.currentTarget.value
    );
    setSelectedStamp({ ...stampData });
  };

  const handleWeightChange = (e) => {
    const weightData = weights.find(
      (weight) => weight.category === e.currentTarget.value
    );
    setSelectedWeight({ ...weightData });
  };

  const getEstimatedValue = () => {
    const convertedWeight = convertWeight(weight, selectedWeight.conversion); // converts the weight type and numerical value to troy ounces
    let metalType;
    if (selectedStamp.id === 16 || selectedStamp.id === 17)
      metalType = "XPT"; // XPT = Platinum
    else if (selectedStamp.id === 19) metalType = "XAG"; // XAG = Silver
    else if (selectedStamp.id === 21) metalType = "XPD"; // XPD = Palladium
    else metalType = "XAU"; // XAU = Gold

    const currentValue = 1 / rates?.rates[metalType];
    const calculations = currentValue * convertedWeight;

    setItemValue(calculations ? calculations : 0);
  };

  const getPrices = async () => {
    if (test) {
      const temp = {
        success: true,
        base: "USD",
        timestamp: 1656671600,
        rates: {
          XAG: 0.05059705,
          XAU: 0.00055831,
          XPD: 0.00053158,
          XPT: 0.00112798,
        },
      };
      localStorage.setItem("currentRates", JSON.stringify(temp));
      setRates(temp);
    } else {
      const URL = `${API}${process.env.REACT_APP_GOLD_API_KEY}${BASE}${base}${CURRENCIES}${currency}`;
      await axios.get(URL).then((res) => {
        localStorage.setItem("currentRates", JSON.stringify(res.data));
        setRates(res.data);
      });
    }
  };

  useEffect(() => {
    checkStorage();
  }, []);

  useEffect(() => {
    getEstimatedValue();
  }, [selectedStamp, selectedWeight, weight]);

  useEffect(() => {
    const lastUpdated = moment(rates?.timestamp * 1000)
      .add(delayOfHouse, "hours")
      .valueOf();
    const currentTime = moment().valueOf();
    setButtonDisabledFlag(currentTime < lastUpdated ? true : false);
  }, [rates]);

  // XAU = Gold, XAG = Silver, XPT = Platinum, XPD = Palladium

  return (
    <Container className="my-4">
      {!buttonDisabledFlag && (
        <Button onClick={() => handleClick()} disabled={buttonDisabledFlag}>
          Get Prices
        </Button>
      )}
      <Row>Prices updated {moment(rates?.timestamp * 1000).fromNow()}</Row>
      <Row>
        <Col> Silver: ${(1 / rates?.rates.XAG).toFixed(2)}/ozt </Col>
        <Col> Gold: ${(1 / rates?.rates.XAU).toFixed(2)}/ozt </Col>
        <Col> Platinum: ${(1 / rates?.rates.XPT).toFixed(2)}/ozt </Col>
        <Col> Palladium: ${(1 / rates?.rates.XPD).toFixed(2)}/ozt</Col>
      </Row>

      <Row>
        <InputGroup>
          <InputGroup.Text>Stamp Type:</InputGroup.Text>
          <Form.Select onChange={handleStampChange}>
            {stamps.map((stamp) => {
              return (
                <option key={stamp.code} value={stamp.code}>
                  {stamp.code}
                </option>
              );
            })}
          </Form.Select>
          <InputGroup.Text>{selectedStamp.meaning} </InputGroup.Text>
        </InputGroup>

        <InputGroup>
          <InputGroup.Text>Weight:</InputGroup.Text>
          <Form.Control
            placeholder={0}
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          <span className="mx-1" />
          <InputGroup.Text>Weight Type:</InputGroup.Text>
          <Form.Select onChange={handleWeightChange}>
            {weights.map((weight) => {
              return (
                <option key={weight.category} value={weight.category}>
                  {weight.category} ({weight.abbreviation})
                </option>
              );
            })}
          </Form.Select>
        </InputGroup>
      </Row>
      <Row style={{ minHeight: "300px" }}>
        <ItemValue selectedStamp={selectedStamp} itemValue={itemValue} />
      </Row>
      <References />
    </Container>
  );
};

export default Calculator;

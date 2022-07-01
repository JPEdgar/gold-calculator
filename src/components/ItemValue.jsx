const ItemValue = ({ itemValue, selectedStamp }) => {
  let returnValue = null;
  let quality = 0;

  if (selectedStamp.id === 0) quality = 0.375;
  else if (selectedStamp.id === 1) quality = 0.417;
  else if (selectedStamp.id === 2) quality = 0.5;
  else if (selectedStamp.id === 3) quality = 0.585;
  else if (selectedStamp.id === 4) quality = 0.75;
  else if (selectedStamp.id === 5) quality = 0.833;
  else if (selectedStamp.id === 6) quality = 0.916;
  else if (selectedStamp.id === 7) quality = 0.999;
  else if (selectedStamp.id === 8)
    returnValue = "Item is a fraction of gold.  Probably not worth much.";
  else if (
    selectedStamp.id === 9 ||
    selectedStamp.id === 10 ||
    selectedStamp.id === 11 ||
    selectedStamp.id === 12
  )
    returnValue = "Item is electroplated.  Not worth much.";
  else if (selectedStamp.id === 13)
    returnValue = "Item is rolled gold plated.  Not worth much.";
  else if (selectedStamp.id === 14)
    returnValue = "Weight gold... calculate?"; // calculate?
  else if (selectedStamp.id === 16 || selectedStamp.id === 17) quality = 0.925;
  else if (selectedStamp.id === 18)
    returnValue = "Item is stainless steel.  Not worth much.";
  else if (selectedStamp.id === 19) quality = 0.925;
  else if (selectedStamp.id === 20)
    returnValue = "Item is titanium.  API doesn't have value for titanium.";
  else if (selectedStamp.id === 21) quality = 0.925;
  else if (selectedStamp.id === 23)
    returnValue = "This could be a ring size.  Look at item again.";
  else
    returnValue = "There is a problem calculating the item's estimated value.";

  return quality ? (
    <h3>Approximate value is ${(itemValue * quality).toFixed(2)}</h3>
  ) : (
    <h3>{returnValue}</h3>
  );
};

export default ItemValue;

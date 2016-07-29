# Changelog

### 0.2.32
- Changed the `errors` prop to allow either an array or object.

### 0.2.31
- `onSubmitExtra` New prop which you can use to pass an object which is then returned as an extra parameter on the onSubmit function

### 0.2.30
- Errors for text inputs are now also displayed above the input (using Material-UI)
- Disable the submit button if there is nothing to submit
- Do not submit fields which have not changed

### 0.2.21
- `buttonType` can now be passed the `IconButton` value for an icon only button.
- `buttonParentStyle` is a new prop that can be used to style the parent `div` element of a Material-UI field.

### 0.2.2
- Customization ability for the Material-UI button. [FR5](https://github.com/Aluminati/meteor-react-autoform/issues/5)
- Allow the use of a custom button instead of our default Material-UI. [FR5](https://github.com/Aluminati/meteor-react-autoform/issues/5)

### 0.2.1
- `useFields` prop has been added back (removed by mistake)

### 0.2.0
- `collection` prop type has been removed
- `schema` prop type has been added and expects your JSON schema (not simple schema)
- Automated testing has been added

### 0.1.1
- Resolved form className prop. [PR2](https://github.com/Aluminati/meteor-react-autoform/pull/2)

### 0.1.0
- React v15 compatibility

## Meteor-React-Autoform
`meteor-react-autoform` will translate your Meteor [aldeed:SimpleSchema](https://github.com/aldeed/meteor-simple-schema) into a [React](https://github.com/facebook/react) form using [Material-UI](https://github.com/callemall/material-ui) components.

## Installation
1. Installed the NPM package: `$ npm i meteor-react-autoform`
2. If you do not already, install the aldeed:collections2 Meteor package: `$ meteor add aldeed:collection2`

## WARNING
This is still in development. Form handling is not available at the moment, this is top priority on the list and will be with the next version in a few days. Basic form elements are available, see below for todo list.

## TODO
 - Manage form submitting
 - Select and multiple select element
 - Array of string elements
 - Object fields
 - Array of object fields
 - Testing possibility

## Usage
### Example
`/client/modules/contactUs/components/contactUsPage.jsx`
```
  import React from 'react';
  import ReactAutoForm from 'meteor-react-autoform';
  import HelpDesk from '/lib/collections/helpDesk';

  const ContactUsPage = () => (
    <div>
      <h1>Contact Us</h1>
      <ReactAutoForm collection={HelpDesk} />
    </div>
  );

  export default ContactUsPage;
```

### ReactAutoForm parameters
 - `collection={HelpDesk}` REQUIRED  You must provide the collection you wish to use for building your form.
 - `useFields={['name', 'text']}` OPTIONAL  Only the fields `name` and `description` will be in the built form.

## SimpleSchema object
#### Example
`/lib/collections/helpDesk.js`
```
  import {Mongo} from 'meteor/mongo';

  const HelpDesk = new Meteor.Collection('helpDesk');

  const schema = {
    name: {
     type: String,
     materialForm: {
       floatingLabelText: 'Name',
       hintText: 'Josh...'
     }
    },
    description: {
     type: String,
     min: 10,
     max: 200,
     materialForm: {
       floatingLabelText: 'Describe your problem',
       rows: 1,
       rowsMax: 10,
       multiLine: true,
       hintText: 'I require a password reset...'
     }
    },
    reoccurringProblem: {
      type: Boolean,
      defaultValue: false,
      label: 'Have you had the problem before?',
      materialForm: {
        switcher: 'Checkbox'
      }
    }
  };

  HelpDesk.attachSchema(schema);

  export default HelpDesk;
```
![Image Preview](formPreview.png)
### Element Examples
- [Text](#element-text)
- [Textarea](#element-textarea)
- [Number](#element-number)
- [Date](#element-date)
- [Tickbox](#element-tickbox)
- [Select Dropdown](#element-selectdropdown)
- [Radio Button](#element-radiobuton)

#### Global parameters
 - `label` String | Input label
 - `max` Number | Set the max length of an input
```
  description: {
    type: String,
    label: 'Description',
    max: 10
  }
```

#### Text <a name="element-text"></a>
A normal text input will only need a type of `String` to display. See [Material-UI text field](http://www.material-ui.com/#/components/text-field) to find what properties are available for passing into our `materialForm` object.
```
  description: {
    type: String,
    materialForm: {
      hintText: 'Please enter the description...'
    }
 }
```
```
  password: {
    type: String,
    label: 'Password',
    materialForm: {
      type: 'password'
    }
  }
```

#### Textarea <a name="element-textarea"></a>
Inside the `materialForm` object, using either `materialForm.rows` `materialForm.rowsMax` or `materialForm.multiLine` will cause the input to turn into a textarea. See [Material-UI text field](http://www.material-ui.com/#/components/text-field) to find what properties are available for passing into our `materialForm` object.
```
  description: {
    type: String,
    materialForm: {
      rows: 1,
      rowsMax: 3,
      multiLine: true
    }
  }
```

#### Number <a name="element-number"></a>
Type `Number` will change the element to a number input. `min` and `max` values are taken into consideration if available. See [Material-UI text field](http://www.material-ui.com/#/components/text-field) to find what properties are available for passing into our `materialForm` object.
```
  favoritePositiveInteger: {
    type: Number,
    max: 10,
    min: 5,
    materialForm: {
      step: 0.2
    }
  }
```


#### Date <a name="element-date"></a>
Type `Date` will provide a date select. `min` and `max` values are taken into consideration if available. See [Material-UI date picker](http://www.material-ui.com/#/components/date-picker) to find what properties are available for passing into our `materialForm` object.
```
  birthday: {
    type: Date,
    label: 'Your birthday',
    //min: new Date('2014-01-01T00:00:00.000Z'),
    materialForm: {
      value: new Date('2014-10-18T00:00:00.000Z'),
      dateMode: 'landscape'
    }
  }
```

#### Tick box <a name="element-tickbox"></a>
Type `Boolean` will use `materialForm.switcher` to determine to display either a checkbox or a toggle component. By default will use the [checkbox Material-UI component](http://www.material-ui.com/#/components/checkbox) `materialForm.switcher = 'Checkbox'`, or if you can change it to use the [toggle component](http://www.material-ui.com/#/components/toggle) `materialForm.switcher = 'Toggle'`. Check out the respective Material-UI documentation on each component to find out what other properties are available for passing into our `materialForm` object.
```
  agree: {
    type: Boolean,
    label: 'Do you agree?',
    materialForm: {
      switcher: 'Checkbox'
      // OR
      //switcher: 'Toggle'
    }
  }
```

#### Select dropdown menu <a name="element-selectdropdown"></a>
Use `allowedValues = []` to create a select dropdown menu. You can provide `materialForm.options = []` to pass through an object`[label: 'Example', value: 'durp']` for each option. You can pass through any [select-field properties](http://www.material-ui.com/#/components/select-field) by using `materialForm.selectOptions = []`.
```
  choose3: {
    type: Number,
    allowedValues: [
      1,
      2,
      3
    ],
    optional: true,
    label: 'Choose a number',
    materialForm: {
      selectOptions: {
        className: 'selectExample'
      },
      options: [
        {
          label: 'One',
          value: 1
        },
        {
          label: 'Two',
          value: 2
        },
        {
          label: 'Three',
          value: 3
        }
      ]
    }
  }
```

#### Radio button <a name="element-radiobuton"></a>
When you use `allowedValues = []` with `materialForm.switcher = 'Radio'` this will display radio box options. You can provide `materialForm.options = []` and pass through any [RadioButton properties](http://www.material-ui.com/#/components/radio-button) into each option, you can also pass through [RadioButtonGroup properties](http://www.material-ui.com/#/components/radio-button) by using `materialForm.groupOptions = []`.
```
  agree: {
    type: String,
    allowedValues: [
      'red',
      'green'
    ],
    label: 'What colour is the sky?',
    materialForm: {
      switcher: 'Radio',
      groupOptions: {
        className: 'radioExample'
      },
      options: [
        {
          label: 'Red',
          value: 'red'
        },
        {
          label: 'Green',
          value: 'green'
        }
      ]
    }
  }
```

# Credits
Developed and maintained by [Aluminati](http://www.aluminati.net/)

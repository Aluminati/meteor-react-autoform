## Meteor-React-Autoform
`meteor-react-autoform` will translate your Meteor [aldeed:SimpleSchema](https://github.com/aldeed/meteor-simple-schema) into a [React](https://github.com/facebook/react) form using [Material-UI](https://github.com/callemall/material-ui) components.

## Installation
1. Installed the NPM package: `$ npm i meteor-react-autoform`
2. Install the Meteor package: `$ meteor add aldeed:collection2`
3. Extend SimpleSchema to allow our `materialForm` object. Recommended to put the code in file `/lib/meteorReactAutoform.js`:
```
  // Documentation -> https://github.com/MechJosh0/meteor-react-autoform
  // Extend the schema to allow our materialForm object
  SimpleSchema.extendOptions({
    materialForm: Match.Optional(Object)
  })
```
4. See the [element examples](#element-examples-list) list to see how to write the `materialForm` object in your schema.

## WARNING
This is still in active development. Document updating is not available at the moment, this is top priority on the list and will be with the next version (hopefully before this weekend). Basic form elements are available, see below for todo list.

## TODO
 - Update existing documents
 - Automated testing
 - Multiple select element
 - Array of string elements
 - Object fields
 - Array of object fields

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
 - `type="insert"` OPTIONAL  This is the default parameter when creating a forum, this tells the forum to insert into the Collection.
 - `type="update"` OPTIONAL  To update a document you must set the `type="update"` and provide either `docId` or `doc` parameter.
    - `type="update" doc={$document}` OPTIONAL  Provide the document object in the `doc` parameter.
 - `useFields={['name', 'text']}` OPTIONAL  Only produce the fields `name` and `description` from the Collection in the form.
 - `formClass="myCustomFormClass"` OPTIONAL  You may provide a custom className for the form, otherwise it will use the default `autoform_{$collectionName}`.
 - `debug={true}` OPTIONAL  This will output the forum data into the console when the user attempts to submit.

## SimpleSchema object
#### Example
`/lib/meteorReactAutoform.js`
```
  // Documentation -> https://github.com/MechJosh0/meteor-react-autoform
  // Extend the schema to allow our materialForm object
  SimpleSchema.extendOptions({
    materialForm: Match.Optional(Object)
  })
```
`/lib/collections/helpDesk.js`
```
  import {Mongo} from 'meteor/mongo';

  const HelpDesk = new Meteor.Collection('helpDesk');

  const schema = {
    name: {
     type: String,
     materialForm: {
       floatingLabelText: 'Your name',
       hintText: 'Sarah Smith...'
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
      defaultValue: true,
      label: 'Have you had the problem before?',
      materialForm: {
        switcher: 'Checkbox'
      }
    }
  };

  HelpDesk.attachSchema(schema);

  HelpDesk.allow({
    insert: (userId, doc) => {
      return true;
    }
  });

  export default HelpDesk;
```
![Image Preview](formPreview.png)
### Element Examples <a name="element-examples-list"></a>
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
    defaultValue: new Date('2014-10-18T00:00:00.000Z'),
    materialForm: {
      dateMode: 'landscape',
      autoOk: true
    }
  }
```

#### Tick box <a name="element-tickbox"></a>
Type `Boolean` will use `materialForm.switcher` to determine to display either a checkbox or a toggle component. By default will use the [checkbox Material-UI component](http://www.material-ui.com/#/components/checkbox) `materialForm.switcher = 'Checkbox'`, or if you can change it to use the [toggle component](http://www.material-ui.com/#/components/toggle) `materialForm.switcher = 'Toggle'`. Check out the respective Material-UI documentation on each component to find out what other properties are available for passing into our `materialForm` object.
```
  agree: {
    type: Boolean,
    label: 'Do you agree?',
    defaultValue: false,
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

## Meteor-React-Autoform
`meteor-react-autoform` will translate your Meteor [aldeed:SimpleSchema](https://github.com/aldeed/meteor-simple-schema) into a [React](https://github.com/facebook/react) form using [Material-UI](https://github.com/callemall/material-ui) components. You can wrap tests around your component and/or the Autoform component, this will also work with [Storybook](https://github.com/kadirahq/react-storybook). This is still in active development but is very possible to use today. Basic form elements are already available, see below for [todo list](#todo-list) and see [Changelog](../../CHANGELOG.MD).

## Requirements
1. `React v15` and `Material-UI v0.15`
2. `Meteor v1.3`

## Installation
1. Installed the NPM package: `$ npm i meteor-react-autoform --save`
2. Install the Meteor package: `$ meteor add aldeed:collection2 aldeed:simple-schema`
3. Extend your SimpleSchema to allow our `materialForm` object. Place the below code above your schema definitions ([see example](#example-schema)):
```
  // Documentation -> https://github.com/MechJosh0/meteor-react-autoform
  // Extend the schema to allow our materialForm object
  SimpleSchema.extendOptions({
    materialForm: Match.Optional(Object)
  })
```
4. See the [element examples](#element-examples-list) list to see how to write the `materialForm` object in your schema.

## TODO <a name="todo-list"></a>
 - Automated testing on updating a document
 - Array of elements
 - Object fields
 - Array of object fields

## Usage
### Example
`/client/modules/contact/components/contactPage.jsx`
```
    import React from 'react';
    import ReactAutoForm from 'meteor-react-autoform';
    import HelpDeskSchema from '/lib/schema/help_desk';
    
    const HelpDesk = () => (
        <div>
        <h1>Contact Us</h1>
        <ReactAutoForm
            errors={this.props.errors}
            onSubmit={this.props.handleInsert}
            schema={HelpDeskSchema}
            type="insert"
        />
        </div>
    );
    
    HelpDesk.propTypes = {
        errors: React.PropTypes.array,
        handleInsert: React.PropTypes.func.isRequired
    };
    
    export default HelpDesk;
```

### ReactAutoForm props
 - `schema={HelpDeskSchema}` REQUIRED  You must provide the collection you wish to use for building your form.
 - `type=["insert", "update"]` REQUIRED  You must set the `type` prop which must equal either `"insert"` or `"update"`.
    - `type="update" doc={$document}` To update a document you must set the `type="update"` and provide the document you wish to update in the `doc` prop.
 - `useFields={['name', 'text']}` OPTIONAL  Only produce the fields `name` and `description` from the Collection in the form.
 - `formClass="myCustomFormClass"` OPTIONAL  You may provide a custom className for the form, otherwise it will use the default `autoform_{$collectionName}`.
 - `debug={true}` OPTIONAL  This will output the form data into the console when the user attempts to submit.
 - `onSubmit` REQUIRED Function to run when the user attempts to submit the forum, this will need to be your Action. See [onSubmit](#onSubmit) for for formation.
 
## onSubmit <a name="onSubmit"></a>
updateTicket(_id, forumFields)
You will need to provide your [Action](https://kadirahq.github.io/mantra/#sec-Actions) (Meteor/Tracker, Redux, Rx.js, etc) as a prop to the React component. When Autoform is submitted
  it will call your `onSubmit` Action function. For an `type={'insert'}` form the Action will be called with just the `forumFields` parameter, for example `yourInsertAction(forumFields)`, whereas a
  form with `type={'update'}` the Action will be called with `docId, formFields` parameters, for example `yourUpdateAction(_id, forumFields)`.

## SimpleSchema object
#### Example <a name="example-schema"></a>
`/lib/collections/helpDesk.js`
```
  import {Mongo} from 'meteor/mongo';

  const HelpDesk = new Meteor.Collection('helpDesk');

  // Documentation -> https://github.com/MechJosh0/meteor-react-autoform
  // Extend the schema to allow our materialForm object
  SimpleSchema.extendOptions({
    materialForm: Match.Optional(Object)
  })

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

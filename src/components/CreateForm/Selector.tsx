import React from 'react';
import classNames from 'classnames';
import WithElementAuth from '@/components/WithElementAuth';
import SetTimeoutManager from '@/utils/SetTimeoutManager';
import {
  Button,
  Input,
  Form,
  // Select,
  // Checkbox,
  // Row,
  // Col,
  // Radio,
  // InputNumber,
  // Slider,
  // Icon,
} from 'antd';
// import DatePicker from '@/components/DateRangePicker/DateRangePicker'
import { trims } from '@/utils/utils';
import { StateType } from '@/common-typings';

// const { TextArea, Search } = Input;
const WithButton = WithElementAuth(Button);


const Selector = (item: StateType, formConfig: StateType, that: any) => {
  const { isMobile } = that.props;
  let results;
  const label = (item.type === 'button') ? '' : item.options.name;
  const width = (formConfig.isPopup || isMobile) ? '100%' : 160;
  const { getFieldDecorator, setFieldsValue } = that.props.form;

  // 获取每一项等规则
  const getFieldParams = () => ({
      validateFirst: true,
      rules: (formConfig.rules && !item.options.disabled) ? formConfig.rules[item.id] : [],
    })

  switch (item.type) {
    // 按钮
    case 'button':
      results = (
        <Button
          {...item.options}
          size={item.size || 'small'}
          loading={item.id === 'submit' && formConfig.loading}
          htmlType={item.id}
          block
          style={item.style || {}}
          onClick={e => {
            e.preventDefault();
            that.beforeSearchCallBack(item.id);
          }}
        >
          {item.options.name}
        </Button>
      );
      break;

    // 输入框
    case 'input':
      results = getFieldDecorator(item.id, getFieldParams())(
        <Input
          style={ item.style || { width } }
          disabled={item.options.disabled || false}
          placeholder={item.options.placeholder || ''}
          type={item.default || 'text'}
          size={item.size || 'small'}
          allowClear={!item.options.disabled}
          addonBefore={
            item.options.addonBefore && item.options.addonBefore(formConfig.config, item)
          }
          onBlur={e => {
            if (e.target.value !== '') {
              // SetTimeoutManager
              // .stopSetTimeout('inputChange')
              //   .addSetTimeout('inputChange', () => {
              //     setFieldsValue({ [item.id]: trims(e.target.value) });
              //   })
              //   .startSetTimout('inputChange', 20);
              // let values = trims(e.target.value);
              // clearTimeout(timerInput)
              // timerInput = setTimeout(() => {
              //   setFieldsValue({ [item.id]: values })
              // }, 20);
            }
          }}
          autoComplete={ item.default === 'password' ? 'new-password' : 'off' }
        />,
      );
      break;
    // case 'daterange':
    //   results = (
    //     getFieldDecorator(item.id, {
    //       validateFirst: true,
    //       rules: (formConfig.rules && !item.options.disabled) ? formConfig.rules[item.id] : []
    //     })(
    //       <DatePicker
    //         config={item}
    //         isPopup={formConfig.isPopup}
    //         isMobile={isMobile}
    //         changeFormState={that.changeFormState}
    //       />
    //     )
    //   )
    //   break;
    case 'email':
      results = (
        <div className="m-email">
          {getFieldDecorator(item.id, getFieldParams())(
            <Input
              style={item.style || { width: formConfig.isPopup || isMobile ? '100%' : 160 }}
              disabled={item.options.disabled || false}
              placeholder={item.options.placeholder || ''}
              type={item.default || 'text'}
              size={item.size || 'small'}
              onBlur={e => {
                if (e.target.value !== '') {
                  SetTimeoutManager
                    .stopSetTimeout('emailChange')
                    .addSetTimeout('emailChange', () => {
                      setFieldsValue({ [item.id]: trims(e.target.value) });
                    })
                    .startSetTimout('emailChange', 20);
                }
              }}
              autoComplete="off"
            />,
          )}
          <WithButton
            auth="true"
            type="primary"
            size="small"
            loading={item.button.loading}
            onClick={() => item.button.callBack()}
          >
            {item.button.text}
          </WithButton>
        </div>
      );
      break;
    // case 'search':
    //   const autoComplete1 = item.default === 'password' ? 'new-password' : 'off';
    //   let enterButton = true;
    //   if (item.options.enterButton) {
    //     enterButton = (
    //       <div className="search-input">
    //         {item.options.loading && <Icon type="loading" />}
    //         <span>{item.options.enterButton}</span>
    //       </div>
    //     );
    //   }
    //   results = getFieldDecorator(item.id, getFieldParams())(
    //     <Search
    //       style={ item.style || { width } }
    //       disabled={item.options.disabled || false}
    //       placeholder={item.options.placeholder || ''}
    //       type={item.default || 'text'}
    //       size={item.size || 'small'}
    //       enterButton={enterButton}
    //       allowClear={!item.options.disabled}
    //       onSearch={value =>
    //         !item.options.loading && item.options.onSearch(value, formConfig.config)
    //       }
    //       onBlur={e => {
    //         if (e.target.value !== '') {
    //           SetTimeoutManager
    //             .stopSetTimeout('searchChange')
    //             .addSetTimeout('searchChange', () => {
    //               setFieldsValue({ [item.id]: trims(e.target.value) });
    //             })
    //             .startSetTimout('searchChange', 20);
    //         }
    //       }}
    //       autoComplete={autoComplete1}
    //     />,
    //   );
    //   break;
    // case 'textarea':
    //   results = getFieldDecorator(item.id, getFieldParams())(
    //     <TextArea
    //       style={ item.style || { width } }
    //       disabled={item.options.disabled || false}
    //       placeholder={item.options.placeholder || ''}
    //       type={item.default || 'text'}
    //       size={item.size || 'small'}
    //       autoComplete="off"
    //       onBlur={e => {
    //         if (e.target.value !== '') {
    //           SetTimeoutManager
    //             .stopSetTimeout('inputNumberChange')
    //             .addSetTimeout('inputNumberChange', () => {
    //               setFieldsValue({ [item.id]: trims(e.target.value) });
    //             })
    //             .startSetTimout('inputNumberChange', 20);
    //         }
    //       }}
    //       rows={4}
    //     />,
    //   );
    //   break;
    // case 'input-number':
    //   let addonBeforeItem;
    //   if (item.options.addonBefore) {
    //     addonBeforeItem = formConfig.config.filter(i => i.id === item.options.addonBefore)[0];
    //     addonBeforeItem.hidden = false;
    //   }
    //   results = getFieldDecorator(item.id, {
    //     validateFirst: true,
    //     rules: formConfig.rules && !item.options.disabled ? formConfig.rules[item.id] : [],
    //   })(
    //     <div
    //       style={{ display: 'inline', width: '100%' }}
    //       className={classNames({ 'inputnumber-group': item.options.addonBefore })}
    //     >
    //       {item.options.addonBefore && Selector(addonBeforeItem, formConfig, that)}
    //       {/* { item.options.getInfo && <div className="group-item-info">{item.options.getInfo(item)}</div> } */}
    //       <InputNumber
    //         value={item.options.value}
    //         style={ item.style || { width } }
    //         disabled={item.options.disabled || false}
    //         placeholder={item.options.placeholder || ''}
    //         precision={2}
    //         // max={(item.options.max === undefined || item.options.max === null) ?  100000000 : ( +item.options.max > 100000000 ? 100000000 : +item.options.max )}
    //         min={item.options.min || 0}
    //         onChange={value => {
    //           SetTimeoutManager
    //             .stopSetTimeout('inputNumberChange')
    //             .addSetTimeout('inputNumberChange', () => {
    //               setFieldsValue({ [item.id]: value });
    //             })
    //             .startSetTimout('inputNumberChange', 20);
    //         }}
    //         size={item.size || 'small'}
    //       />
    //     </div>,
    //   );
    //   break;
    // case 'select':
    //   results = getFieldDecorator(item.id, getFieldParams())(
    //     <Select
    //       style={ item.style || { width } }
    //       size={item.size || 'small'}
    //       disabled={item.options.disabled || false}
    //       showSearch={item.options.showSearch || false}
    //       placeholder={item.options.placeholder || ''}
    //       onChange={e => {
    //         item.options.callBack && item.options.callBack(e);
    //       }}
    //       filterOption={(input, option) =>
    //         option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
    //       }
    //       allowClear={item.options.allowClear !== undefined ? item.options.allowClear : true}
    //     >
    //       {item.options.list.map(listItem =>
    //         !listItem.hidden ? (
    //           <Select.Option key={listItem.value} value={listItem.value}>
    //             {listItem.label}
    //           </Select.Option>
    //         ) : null,
    //       )}
    //     </Select>,
    //   );
    //   break;
    // case 'checkbox':
    //   results = getFieldDecorator(item.id, getFieldParams())(
    //     <Checkbox.Group style={{ width: '100%' }}>
    //       {item.options.list.map(listItem => (
    //         <Checkbox
    //           key={listItem.value}
    //           value={listItem.value}
    //           disabled={listItem.disabled || false}
    //         >
    //           {listItem.label}
    //         </Checkbox>
    //       ))}
    //     </Checkbox.Group>,
    //   );
    //   break;
    // case 'radio-group':
    //   results = getFieldDecorator(item.id, getFieldParams())(
    //     <Radio.Group style={{ width: '100%' }}>
    //       {item.options.list.map(listItem => (
    //         <Radio
    //           key={listItem.value}
    //           value={listItem.value}
    //           disabled={listItem.disabled || false}
    //         >
    //           {listItem.label}
    //         </Radio>
    //       ))}
    //     </Radio.Group>,
    //   );
    //   break;

    case 'template':
      results = item.options.template(item);
      break;
    default:
      break;
  }


  const formItemLayout = item.formItemLayout || {};
  return (
    <Form.Item
      key={item.id}
      label={label}
      {...formItemLayout}
      className={classNames(formConfig.className, {
        'st-form-group': !formConfig.isPopup,
        'st-form-group-pop': formConfig.isPopup,
        'st-from-group-noLabel': !label,
        'st-from-group-symbol': item.options.addonBefore,
      })}
    >
      {results}
      {item.options.icon && item.options.icon()}
    </Form.Item>
  );
};

export default Selector;

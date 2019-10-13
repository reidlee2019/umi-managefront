import React from 'react';
import classNames from 'classnames';
import { Button, Input, Form, Select } from 'antd';
// import DatePicker from '@/components/DateRangePicker/DateRangePicker'
// import { trims } from '@/utils/utils';
import { GlobalState } from '@/models/connect';


const Case = (item: any, formConfig: GlobalState, that: any) => {
  let result;
  let label = '';
  const { getFieldDecorator } = that.props.form;
  switch (item.type) {
    case 'input':
      label = item.options.name;
      result = (
        getFieldDecorator(item.id, {
          validateFirst: true,
          rules: (formConfig.rules && !item.options.disabled) ? formConfig.rules[item.id] : [],
        })(
          <Input
            style={item.style || { width: 160 }}
            disabled={item.options.disabled || false}
            placeholder={item.options.placeholder || ''}
            type={item.default || 'text'}
            size={item.size || 'small'}
            onBlur={(e) => {}}
            autoComplete={ item.default === 'password' ? 'new-password' : 'off' }
          />,
        )
      );
      break;
    case 'button':
      result = (
        <Button
          {...item.options}
          size={item.size || 'small'}
          loading={ item.id === 'submit' && formConfig.loading }
          htmlType={item.id}
          block
          style={item.style || {}}
          onClick={(e) => {
            e.preventDefault()
            // that.beforeSearchCallBack(item.id)
          }}
        >
          {item.options.name}
        </Button>
      );
      break;
    case 'select':
      label = item.options.name;
      result = (
        getFieldDecorator(item.id, {
          validateFirst: true,
          rules: (formConfig.rules && !item.options.disabled) ? formConfig.rules[item.id] : []
        })(
          <Select
            size={item.size || 'small'}
            style={item.style || { width: 160 }}
            disabled={item.options.disabled || false}
            showSearch={item.options.showSearch || false}
            placeholder={item.options.placeholder || ''}
            allowClear={item.options.allowClear !== undefined ? item.options.allowClear : true}
          >
            {
              item.options.list.map((listItem: any) =>
                !listItem.hidden ?
                  <Select.Option
                    key={listItem.value}
                    value={listItem.value}
                  >{listItem.label}</Select.Option>
                  : null)
            }
          </Select>,
        )
      );
      break;
    case 'template':
      label = item.options.name;
      result = item.options.template(item)
      break;
    default:
      break;
  }

  const formItemLayout = item.formItemLayout || {};
  return (
    <Form.Item key={item.id} label={label}
       {...formItemLayout}
       className={classNames(formConfig.className, {
         'm-form-group': !formConfig.isPop,
         'm-form-group-pop': formConfig.isPop,
         'm-from-group-noLabel': !label,
       })}
    >
      {result}
      {item.options.icon && item.options.icon()}
    </Form.Item>
  )
};

export default Case

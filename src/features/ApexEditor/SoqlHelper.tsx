import { Dropdown, Image, Text } from "@nextui-org/react";

type SoqlHelperProps = {
  appendCode: (query: string) => void;
};

type SoqlQueryOption = {
  sObject: string;
  plural: string;
};

const SOQL_QUERY_OPTIONS: SoqlQueryOption[] = [
  {
    sObject: "User",
    plural: "Users",
  },
  {
    sObject: "Account",
    plural: "Accounts",
  },
  {
    sObject: "Contact",
    plural: "Contacts",
  },
];

function makeDefaultQuery(opt: SoqlQueryOption) {
  return `\nList<${
    opt.sObject
  }> ${opt.plural.toLowerCase()} = [SELECT Id FROM ${opt.sObject}];`;
}

function SoqlHelper({ appendCode }: SoqlHelperProps) {
  function renderDropdownItem(opt: SoqlQueryOption) {
    return (
      <Dropdown.Item
        key={opt.sObject}
        textValue={opt.sObject}
        color="secondary"
        icon={<Image src="/astro.png" alt="logo" height={20} />}
      >
        <Text
          color="secondary"
          onClick={() => appendCode(makeDefaultQuery(opt))}
        >
          {`Query ${opt.sObject}`}
        </Text>
      </Dropdown.Item>
    );
  }

  return (
    <Dropdown>
      <Dropdown.Button flat color="secondary" css={{ mr: 10 }} size="sm">
        Insert SOQL
      </Dropdown.Button>
      <Dropdown.Menu aria-label="Static Actions">
        {SOQL_QUERY_OPTIONS.map((opt) => renderDropdownItem(opt))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default SoqlHelper;

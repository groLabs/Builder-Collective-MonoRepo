// @ts-nocheck

import * as yup from "yup";

yup.addMethod(yup.array, "unique", function (message) {
  return this.test("unique", message, function (list) {
    const mapper = (x: any) => x.address;
    const set = [...new Set(list.map(mapper))];
    const finalSet = set.filter((elem) => !elem);
    const isUnique = list?.length === set.length;
    if (isUnique || finalSet.length === 0) {
      return true;
    }

    const idx = list?.findIndex((l, i) => mapper(l) !== set[i]);

    if (!list[idx].address) {
      return true;
    }

    return this.createError({
      path: `users.[${idx}].address`,
      message: message,
    });
  });
});

export const schema = yup.object({
  users: yup
    .array()
    .unique("The addresses cannot be duplicated")
    .of(
      yup.object({
        address: yup.lazy((value) =>
          !value
            ? yup.string()
            : yup
                .string()
                .matches(/^0x[a-fA-F0-9]{40}$/g, "Please enter a valid address")
        ),
        name: yup
          .string()
          .when("address", {
            is: (val) => !!val,
            then: yup.string().required('This field is required'),
          }),
      })
    ),
});

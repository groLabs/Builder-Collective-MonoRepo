// @ts-nocheck

import * as yup from "yup";

yup.addMethod(yup.array, "unique", function (message) {
  return this.test("unique", message, function (list) {
    const mapper = (x: any) => x.token;
    const set = [...new Set(list.map(mapper))];
    const isUnique = list?.length === set.length;

    const finalSet = set.filter((elem) => !!elem);
    if (isUnique || finalSet.length === 0) {
      return true;
    }

    const idx = list?.findIndex((l, i) => mapper(l) !== set[i]);

     if (!list[idx].token) {
       return true;
     }
    

    return this.createError({
      path: `tokens.[${idx}].token`,
      message: message,
    });
  });
});

export const schema = yup.object({
  tokens: yup
    .array()
    .unique("The tokens cannot be duplicated")
    .of(
      yup.object({
        token: yup.string(),
        price: yup.lazy(value => !!value ? yup.number() : yup.mixed())
      })
    ),
});

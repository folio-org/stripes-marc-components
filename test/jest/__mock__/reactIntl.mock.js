jest.mock('react-intl', () => {
  const intl = {
    formatMessage: ({ id }) => id,
    formatDate: date => date,
  };

  return {
    ...jest.requireActual('react-intl'),
    FormattedMessage: jest.fn(({ id, children, values }) => {
      if (children) {
        return children([id]);
      }

      return (
        <>
          {id}
          {values && Object.entries(values).map(([key, value]) => (
            <span key={key}>{value}</span>
          ))}
        </>
      );
    }),
    FormattedTime: jest.fn(({ value, children }) => {
      if (children) {
        return children([value]);
      }

      return value;
    }),
    useIntl: () => intl,
    injectIntl: Component => function (props) {
      return <Component {...props} intl={intl} />;
    },
  };
});

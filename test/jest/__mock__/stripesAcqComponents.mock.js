jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useUsersBatch: jest.fn().mockReturnValue({
    users: [
      {
        username: 'username',
        id: 'user-id',
        personal: {
          lastName: 'lastName',
          firstName: 'firstName',
        },
      },
    ],
  }),
}));

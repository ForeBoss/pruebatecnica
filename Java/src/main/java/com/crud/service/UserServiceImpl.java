package com.crud.service;

import com.crud.dto.UserDto;
import com.crud.exception.ResourceNotFoundException;
import com.crud.model.User;
import com.crud.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));
    }

    @Override
    public User createUser(UserDto userDto) {
        User user = new User();
        user.setNombre(userDto.getNombre());
        user.setCorreo(userDto.getCorreo());
        user.setEdad(userDto.getEdad());
        return userRepository.save(user);
    }

    @Override
    public User updateUser(Long id, UserDto userDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado con ID: " + id));

        user.setNombre(userDto.getNombre());
        user.setCorreo(userDto.getCorreo());
        user.setEdad(userDto.getEdad());

        return userRepository.save(user);
    }


    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("Usuario no encontrado con ID: " + id);
        }
        userRepository.deleteById(id);
    }
}